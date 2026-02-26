import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod/v4';
import { createPaginatedQuerySchema } from '@/common/validation.utils';
import {
  sortableUserFields,
  VALID_USER_ROLES,
} from '@/entities/user/user.constants';
import { users } from '@/entities/user/user.schema';

export const userSchema = createSelectSchema(users);

export const createUserSchema = createInsertSchema(users);

export const updateUserSchema = createUpdateSchema(users);

export const userQueryFilters = z.object({
  role: z.enum(VALID_USER_ROLES).optional(),
  gender: z.string().optional(),
});

export const userQuerySchema = createPaginatedQuerySchema(
  sortableUserFields,
  'createdAt',
  userQueryFilters.shape
);
