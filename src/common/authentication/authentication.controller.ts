import type { Request, Response } from 'express';
import { UnauthorizedError } from '@/common/error.types';
import { AUTH_CONSTANTS } from './authentication.constants';
import type { AuthenticationService } from './authentication.service';
import type { LogoutResponse } from './authentication.types';
import { parseExpiryTime } from './authentication.utils';
import { loginSchema } from './authentication.validation';

export class AuthenticationController {
  private authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  async login(req: Request, res: Response): Promise<void> {
    const validatedData = loginSchema.parse(req.body);
    const result = await this.authenticationService.login(validatedData);

    // Set refresh token as HTTP-only cookie
    const refreshTokenExpiry = parseExpiryTime(
      AUTH_CONSTANTS.JWT_REFRESH_EXPIRES_IN
    );
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenExpiry,
      path: '/',
    });

    // Return only access token and user data (no refresh token in response body)
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        userData: result.userData,
      },
    });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    // Get refresh token from HTTP-only cookie instead of request body
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    const result =
      await this.authenticationService.refreshAccessTokenSecure(refreshToken);

    // Set new refresh token as HTTP-only cookie
    const refreshTokenExpiry = parseExpiryTime(
      AUTH_CONSTANTS.JWT_REFRESH_EXPIRES_IN
    );
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenExpiry,
      path: '/',
    });

    // Return only access token (no refresh token in response body)
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies?.refreshToken;

    // Revoke the refresh token if it exists
    if (refreshToken) {
      await this.authenticationService.logout(refreshToken);
    }

    // Clear the HTTP-only cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    const response: LogoutResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    res.status(200).json(response);
  }
}
