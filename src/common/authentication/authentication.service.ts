import type { Result } from "@/common/common.types";
import type { UserRepository } from "@/entities/user/user.repository";
import type { User } from "@/entities/user/user.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { AUTH_CONSTANTS, AUTH_ERRORS } from "./authentication.constants";
import type {
  JWTPayload,
  LoginRequest,
  RefreshToken,
  SecureLoginResponse,
  SecureRefreshTokenResponse
} from "./authentication.types";
import { parseExpiryTime } from "./authentication.utils";
import { RefreshTokenRepository } from "./refresh-token.repository";

export class AuthenticationService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(
    userRepository: UserRepository,
    refreshTokenRepository?: RefreshTokenRepository,
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository =
      refreshTokenRepository ?? new RefreshTokenRepository();
  }

  // Main public method - orchestrates the login flow
  async login(loginData: LoginRequest): Promise<SecureLoginResponse> {
    const { email, password } = loginData;

    const user = await this.validateUserCredentials(email, password);
    const safeUser = await this.getUserSafe(user.id);
    await this.updateUserLoginActivity(user.id);

    const accessToken = this.generateAccessToken(user);
    const refreshTokenResult = await this.generateRefreshToken(user.id);
    if (!refreshTokenResult.success) throw refreshTokenResult.error;
    const refreshToken = refreshTokenResult.data;

    await this.refreshTokenRepository.deleteOldestTokensForUser(
      user.id,
      AUTH_CONSTANTS.MAX_REFRESH_TOKENS_PER_USER,
    );

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: safeUser,
    };
  }

  // Secure refresh method that works with HTTP-only cookies
  async refreshAccessTokenSecure(
    refreshToken: string,
  ): Promise<SecureRefreshTokenResponse> {
    const isValid = await this.refreshTokenRepository.isTokenValid(refreshToken);
    if (!isValid) {
      throw new Error(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    const tokenDataResult = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenDataResult.success) throw tokenDataResult.error;
    const tokenData = tokenDataResult.data;

    const userResult = await this.userRepository.findOne(tokenData.userId);
    if (!userResult.success) throw userResult.error;
    const user = userResult.data;

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshTokenResult = await this.generateRefreshToken(user.id);
    if (!newRefreshTokenResult.success) throw newRefreshTokenResult.error;
    const newRefreshToken = newRefreshTokenResult.data;

    await this.refreshTokenRepository.revokeToken(refreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenRepository.revokeToken(refreshToken);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  private async validateUserCredentials(email: string, password: string) {
    const result = await this.userRepository.findByEmail(email);
    if (!result.success) throw result.error;
    const user = result.data;
    await this.verifyPassword(password, user.password);
    return user;
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isValid) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
  }

  public async getUserSafe(userId: string) {
    const result = await this.userRepository.findOne(userId);
    if (!result.success) throw result.error;
    const user = result.data;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async updateUserLoginActivity(userId: string) {
    const result = await this.userRepository.updateLastLogin(userId);
    if (!result.success) throw result.error;
  }

  private generateAccessToken(user: User): string {
    return this.generateToken({
      id: user.id,
      email: user.email,
    });
  }

  private generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    const options: jwt.SignOptions = {
      expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, AUTH_CONSTANTS.JWT_SECRET, options);
  }

  private async generateRefreshToken(userId: string): Promise<Result<RefreshToken>> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setTime(
      expiresAt.getTime() +
      parseExpiryTime(AUTH_CONSTANTS.JWT_REFRESH_EXPIRES_IN),
    );

    return await this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
      isRevoked: false,
    });
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString("hex");
  }
}
