import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotFoundError } from '@/common/error.types';
import { UniverseRepository } from '@/entities/universe/universe.repository';

const universeRepository = new UniverseRepository();

/**
 * Middleware to validate that the authenticated user owns the specified universe.
 * Looks for universeId in params, body, or x-universe-id header.
 */
export const validateUniverseOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return next(new ForbiddenError('User not authenticated'));
  }

  const universeId =
    req.params.universeId ||
    req.body.universeId ||
    req.headers['x-universe-id'];

  if (!universeId || typeof universeId !== 'string') {
    return next(new ForbiddenError('Universe ID is required for this action'));
  }

  try {
    const universe = await universeRepository.findById(universeId);

    if (!universe) {
      return next(new NotFoundError('Universe', universeId));
    }

    if (universe.ownerId !== user.id) {
      return next(
        new ForbiddenError('You do not have ownership of this universe')
      );
    }

    // Attach universe to request for later use
    (req as Request & { universe: unknown }).universe = universe;

    next();
  } catch (error) {
    next(error);
  }
};
