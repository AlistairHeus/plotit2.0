import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  AUTH_CONSTANTS,
  AUTH_ERRORS,
} from '@/common/authentication/authentication.constants';
import { jwtPayloadSchema } from '@/common/authentication/authentication.validation';
import type { AuthenticatedUser } from '@/entities/user/user.types';

type ValidationResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; status: number; error: string; details?: unknown };
export const authenticateToken = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: AUTH_ERRORS.TOKEN_REQUIRED });
    }

    try {
      const result = validateJwtToken(token);

      if (!result.success) {
        const response: { error: string; details?: unknown } = {
          error: result.error,
        };
        if (result.details) {
          response.details = result.details;
        }
        return res.status(result.status).json(response);
      }

      req.user = result.user;
      return next();
    } catch (error) {
      const errorResult = handleJwtError(error);
      if (!errorResult.success) {
        return res
          .status(errorResult.status)
          .json({ error: errorResult.error });
      }
      // This should never happen, but TypeScript needs it
      return res.status(500).json({ error: 'Unexpected error' });
    }
  };
};
/**
 * Extracts token from Authorization header
 */
function extractToken(authHeader: string | undefined): string | null {
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
}
/**
 * Validates and parses JWT token
 */
function validateJwtToken(token: string): ValidationResult {
  // Verify JWT token
  const decoded = jwt.verify(token, AUTH_CONSTANTS.JWT_SECRET);

  // Validate that decoded is an object (not a string)
  if (typeof decoded === 'string') {
    return {
      success: false,
      status: 401,
      error: AUTH_ERRORS.TOKEN_INVALID,
    };
  }

  // Validate JWT payload structure using Zod schema
  const validationResult = jwtPayloadSchema.safeParse(decoded);

  if (!validationResult.success) {
    return {
      success: false,
      status: 401,
      error: AUTH_ERRORS.TOKEN_INVALID,
      details: validationResult.error.issues,
    };
  }

  const payload = validationResult.data;

  return {
    success: true,
    user: {
      id: payload.id,
      role: payload.role as AuthenticatedUser['role'],
      email: payload.email,
    },
  };
}
/**
 * Handles JWT verification errors
 */
function handleJwtError(error: unknown): ValidationResult {
  if (error instanceof jwt.JsonWebTokenError) {
    return {
      success: false,
      status: 401,
      error: AUTH_ERRORS.TOKEN_INVALID,
    };
  }

  if (error instanceof jwt.TokenExpiredError) {
    return {
      success: false,
      status: 401,
      error: 'Token has expired',
    };
  }

  if (error instanceof jwt.NotBeforeError) {
    return {
      success: false,
      status: 401,
      error: 'Token not active yet',
    };
  }

  return {
    success: false,
    status: 500,
    error: 'Authentication error',
  };
}
export const authorize = (
  policyFn: (
    user: AuthenticatedUser,
    resource?: Record<string, unknown>
  ) => boolean
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req;

    // Check if user exists (should be set by authenticateToken middleware)
    if (!authenticatedReq.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get resource from request (basic implementation for now)
    const resource = getResourceFromRequest(req);

    // Apply policy function
    if (policyFn(authenticatedReq.user, resource)) {
      return next();
    }
    return res.status(403).json({ error: 'Access denied' });
  };
};
function getResourceFromRequest(req: Request): Record<string, unknown> {
  // Basic implementation - can be enhanced based on route patterns
  const resourceId = req.params.id;
  const route = req.route?.path || req.path;

  // For now, return basic resource info
  // This can be enhanced to actually fetch resources from database
  return {
    id: resourceId,
    route,
    params: req.params,
  };
}
