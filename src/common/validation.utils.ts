import { z } from 'zod/v4';
import { paginationQuerySchema } from '@/common/common.validation';

export function createPaginatedQuerySchema<
  T extends readonly [string, ...string[]],
  F extends z.ZodRawShape = Record<string, never>,
>(sortableFields: T, defaultSortBy: T[number], additionalFilters?: F) {
  const baseSchema = paginationQuerySchema.omit({
    sortBy: true,
    sortOrder: true,
  });

  const schemaShape = {
    sortBy: z.enum(sortableFields).optional().default(defaultSortBy),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    ...(additionalFilters || ({} as F)),
  };

  return baseSchema.extend(schemaShape);
}
