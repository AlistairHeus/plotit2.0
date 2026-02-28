import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AUTH_CONSTANTS, AUTH_ERRORS } from "@/common/authentication/authentication.constants";
import { jwtPayloadSchema } from "@/common/authentication/authentication.validation";
import { UnauthorizedError } from "@/common/error.types";

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    next(new UnauthorizedError(AUTH_ERRORS.TOKEN_REQUIRED)); return;
  }

  try {
    const decoded = jwt.verify(token, AUTH_CONSTANTS.JWT_SECRET);

    // Zod validation provides the type safety naturally
    const payload = jwtPayloadSchema.parse(decoded);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    next(new UnauthorizedError(AUTH_ERRORS.TOKEN_INVALID));
  }
};