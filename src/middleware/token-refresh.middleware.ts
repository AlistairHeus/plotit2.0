import type { NextFunction, Request, Response } from 'express';
import { AUTH_CONSTANTS } from '@/common/authentication/authentication.constants';
import { AuthenticationService } from '@/common/authentication/authentication.service';
import { parseExpiryTime } from '@/common/authentication/authentication.utils';
import { UserRepository } from '@/entities/user/user.repository';

/**
 * Middleware to automatically refresh expired access tokens
 * This should be applied globally to intercept 401 responses
 */
export const createTokenRefreshMiddleware = () => {
  const userRepository = new UserRepository();
  const authService = new AuthenticationService(userRepository);

  return (req: Request, res: Response, next: NextFunction) => {
    // Store original methods
    const originalStatus = res.status;
    const originalJson = res.json;

    // Override status method to capture status codes
    res.status = function (code: number) {
      res.statusCode = code;
      return originalStatus.call(this, code);
    };

    // Override json method to intercept 401 responses
    res.json = function (body: Record<string, unknown>) {
      // Check if this is a 401 unauthorized response with token-related error
      if (
        res.statusCode === 401 &&
        body?.error &&
        typeof body.error === 'string' &&
        (body.error.includes('expired') ||
          body.error.includes('invalid') ||
          body.error.includes('Token'))
      ) {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
          // Attempt to refresh the token
          authService
            .refreshAccessTokenSecure(refreshToken)
            .then((result) => {
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

              // Set status to 200 and return new token
              res.statusCode = 200;
              res.setHeader('X-Token-Refreshed', 'true');
              originalJson.call(this, {
                success: true,
                data: {
                  accessToken: result.accessToken,
                },
                tokenRefreshed: true,
              });
            })
            .catch(() => {
              // If refresh fails, clear the invalid refresh token cookie
              res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
              });

              // Return original 401 response
              originalJson.call(this, body);
            });

          return this;
        }
      }

      // For all other responses, call original json method
      return originalJson.call(this, body);
    };

    next();
  };
};
