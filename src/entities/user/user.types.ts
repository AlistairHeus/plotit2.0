import type { z } from 'zod/v4';
import type { users } from '@/entities/user/user.schema';
import type {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from '@/entities/user/user.validation';

export type User = typeof users.$inferSelect;

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;

export type SafeUser = Omit<User, 'password' | 'lastLoginAt'>;

export type CreateUserWithProfile = {
  user: CreateUser;
  profile: unknown;
};

export type UpdateUserWithProfile = {
  user?: UpdateUser | undefined;
  profile?: unknown | undefined;
};

export type AuthenticatedUser = Omit<
  SafeUser,
  'createdAt' | 'updatedAt' | 'firstName' | 'lastName'
>;

export type UserDTO = {
  user: SafeUser;
  profile: unknown;
};

// Base interface that all role query params should extend
export interface BaseQueryParams {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
