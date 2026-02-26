import { z } from 'zod/v4';

// Extended pagination schema with coercion for query parameters
export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(1).optional().default(1),
  offset: z.coerce.number().int().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

export const paramsSchema = z.uuid().trim();
