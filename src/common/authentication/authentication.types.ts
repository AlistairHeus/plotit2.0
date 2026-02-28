import type {
  jwtPayloadSchema,
  loginSchema
} from "@/common/authentication/authentication.validation";
import type { refreshTokens } from "@/common/authentication/refresh-token.schema";
import type { AuthenticatedUser, SafeUser } from "@/entities/user/user.types";
import type { z } from "zod";

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;


export type RefreshToken = typeof refreshTokens.$inferSelect;

export type CreateRefreshToken = typeof refreshTokens.$inferInsert;

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
