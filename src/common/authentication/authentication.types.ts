import type { z } from 'zod/v4';
import type {
  jwtPayloadSchema,
  loginSchema,
  refreshTokenSchema,
} from '@/common/authentication/authentication.validation';
import type { refreshTokens } from '@/common/authentication/refresh-token.schema';
import type { AuthenticatedUser, UserDTO } from '@/entities/user/user.types';

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

export type RefreshToken = typeof refreshTokens.$inferSelect;

export type CreateRefreshToken = typeof refreshTokens.$inferInsert;

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userData: UserDTO;
};

export type SecureLoginResponse = {
  accessToken: string;
  refreshToken: string; // This will be set as HTTP-only cookie
  userData: UserDTO;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SecureRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string; // This will be set as HTTP-only cookie
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}
