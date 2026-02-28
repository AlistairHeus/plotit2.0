import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, NotFoundError } from "@/common/error.types";
import { UniverseRepository } from "@/entities/universe/universe.repository";

const universeRepository = new UniverseRepository();

/**
 * Middleware to validate that the authenticated user owns the specified universe.
 * Looks for universeId in params, body, or x-universe-id header.
 */
export const validateUniverseOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user) {
    next(new ForbiddenError("User not authenticated"));
    return;
  }

  const universeId =
    req.params.universeId ||
    req.body.universeId ||
    req.headers["x-universe-id"];

  if (!universeId || typeof universeId !== "string") {
    next(new ForbiddenError("Universe ID is required for this action"));
    return;
  }

  try {
    const universeResult = await universeRepository.findOne(universeId);
    const universe = universeResult.success ? universeResult.data : null;

    if (!universe) {
      next(new NotFoundError("Universe", universeId));
      return;
    }

    if (universe.userId !== user.id) {
      next(new ForbiddenError("You do not have ownership of this universe"));
      return;
    }

    // Attach universe to request for later use
    (req as Request & { universe: unknown }).universe = universe;

    next();
  } catch (error) {
    next(error);
  }
};
