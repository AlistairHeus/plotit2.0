import type { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "@/common/error.types";
import { UniverseRepository } from "@/entities/universe/universe.repository";

const universeRepository = new UniverseRepository();

/**
 * Type Guard to safely narrow 'any' (like req.body) to a record.
 * This prevents the "Unsafe member access" lint error.
 */
const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null;

/**
 * Simple helper to ensure a value is a string without using 'as'.
 */
const asString = (val: unknown): string | undefined =>
  typeof val === "string" ? val : undefined;

/**
 * Middleware to validate that the authenticated user owns the specified universe.
 */
export const validateUniverseOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { user } = req;

  if (!user) {
    next(new ForbiddenError("User not authenticated")); return;
  }

  // 1. Resolve the header (handling potential string[])
  const rawHeader = req.headers["x-universe-id"];
  const headerValue = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

  // 2. Resolve the body safely. 
  // By checking isRecord, req.body is narrowed from 'any' to 'Record<string, unknown>'
  const body = isRecord(req.body) ? req.body : {};

  // 3. Use Nullish Coalescing for the ID lookup chain.
  // This satisfies 'prefer-nullish-coalescing' and 'no-unsafe-assignment'.
  const universeId =
    asString(req.params.universeId) ??
    asString(body.universeId) ??
    asString(headerValue);

  if (!universeId) {
    next(new ForbiddenError("Universe ID is required for this action")); return;
  }

  try {
    const result = await universeRepository.findOne(universeId);

    if (!result.success) {
      next(result.error); return;
    }

    const universe = result.data;

    if (universe.userId !== user.id) {
      next(new ForbiddenError("You do not have ownership of this universe")); return;
    }

    // req.universe is already typed in your global d.ts, so this is safe.
    req.universe = universe;

    next(); return;
  } catch (error) {
    next(error); return;
  }
};