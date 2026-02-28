import type {
  jwtPayloadSchema,
  loginSchema
} from "@/common/authentication/authentication.validation";
import type { AuthenticatedUser, SafeUser } from "@/entities/user/user.types";
import type { z } from "zod";

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deviceInfo: string | null;
  ipAddress: string | null;
}

export interface CreateRefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked?: boolean;
  deviceInfo?: string | null;
  ipAddress?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

export interface SecureLoginResponse {
  accessToken: string;
  refreshToken: string; // This will be set as HTTP-only cookie
  user: SafeUser;
}

export interface SecureRefreshTokenResponse {
  accessToken: string;
  refreshToken: string; // This will be set as HTTP-only cookie
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}
