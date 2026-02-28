import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserRepository } from '@/entities/user/user.repository';
import type { User } from '@/entities/user/user.types';
import { AUTH_CONSTANTS, AUTH_ERRORS } from './authentication.constants';
import type {
  JWTPayload,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SecureLoginResponse,
  SecureRefreshTokenResponse,
} from './authentication.types';
import { parseExpiryTime } from './authentication.utils';
import { RefreshTokenRepository } from './refresh-token.repository';

export class AuthenticationService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(
    userRepository: UserRepository,
    refreshTokenRepository?: RefreshTokenRepository
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository =
      refreshTokenRepository || new RefreshTokenRepository();
  }

  // Main public method - orchestrates the login flow
  async login(loginData: LoginRequest): Promise<SecureLoginResponse> {
    const { email, password } = loginData;

    const user = await this.validateUserCredentials(email, password);
    const safeUser = await this.getUserSafe(user.id);
    await this.updateUserLoginActivity(user.id);

    // Generate both access and refresh tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Clean up old tokens for this user
    await this.refreshTokenRepository.deleteOldestTokensForUser(
      user.id,
      AUTH_CONSTANTS.MAX_REFRESH_TOKENS_PER_USER
    );

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: safeUser,
    };
  }

  // Refresh access token using refresh token (legacy method for backward compatibility)
  async refreshAccessToken(
    refreshData: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshData;
    return await this.refreshAccessTokenSecure(refreshToken);
  }

  // Secure refresh method that works with HTTP-only cookies
  async refreshAccessTokenSecure(
    refreshToken: string
  ): Promise<SecureRefreshTokenResponse> {
    // Validate refresh token
    const isValid =
      await this.refreshTokenRepository.isTokenValid(refreshToken);
    if (!isValid) {
      throw new Error(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    // Get refresh token from database
    const tokenResult =
      await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenResult.success) {
      throw new Error(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    const tokenData = tokenResult.data;

    // Get user data by ID using the proper repository method
    const userResult = await this.userRepository.findOne(tokenData.userId);
    if (!userResult.success) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }

    const user = userResult.data;

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    // Revoke old refresh token
    await this.refreshTokenRepository.revokeToken(refreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  // Logout - revoke refresh token
  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenRepository.revokeToken(refreshToken);
    }
  }

  // Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  private async validateUserCredentials(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return user;
  }

  private async findUserByEmail(email: string) {
    const result = await this.userRepository.findByEmail(email);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isValid) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
  }

  public async getUserSafe(userId: string) {
    const result = await this.userRepository.findOne(userId);
    if (!result.success) {
      throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
    }
    const {
      password: _password,
      lastLoginAt: _lastLoginAt,
      ...safeUser
    } = result.data;
    return safeUser;
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

  private generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(
      payload,
      AUTH_CONSTANTS.JWT_SECRET as string,
      {
        expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN,
      } as jwt.SignOptions
    );
  }

  private async generateRefreshToken(userId: string) {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setTime(
      expiresAt.getTime() +
      parseExpiryTime(AUTH_CONSTANTS.JWT_REFRESH_EXPIRES_IN)
    );

    return await this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
      isRevoked: false,
    });
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }
}
