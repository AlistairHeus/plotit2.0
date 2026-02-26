import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod/v4';
import { createPaginatedQuerySchema } from '@/common/validation.utils';
import { sortableUserFields } from '@/entities/user/user.constants';
import { users } from '@/entities/user/user.schema';

export const userSchema = createSelectSchema(users);

export const createUserSchema = createInsertSchema(users);

export const updateUserSchema = createUpdateSchema(users);

export const userQueryFilters = z.object({});

export const userQuerySchema = createPaginatedQuerySchema(
  sortableUserFields,
  'createdAt',
  userQueryFilters.shape
);
