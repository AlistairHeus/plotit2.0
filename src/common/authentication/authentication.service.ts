import type { UserRepository } from "@/entities/user/user.repository";
import type { User } from "@/entities/user/user.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { AUTH_CONSTANTS, AUTH_ERRORS } from "./authentication.constants";
import type {
  JWTPayload,
  LoginRequest,
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
    const refreshToken = await this.generateRefreshToken(user.id);

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

    const tokenData = await this.refreshTokenRepository.findByToken(refreshToken);
    const user = await this.userRepository.findOne(tokenData.userId);

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user.id);

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
    const user = await this.userRepository.findByEmail(email);
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
    const user = await this.userRepository.findOne(userId);

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
    await this.userRepository.updateLastLogin(userId);
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

  private async generateRefreshToken(userId: string) {
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
