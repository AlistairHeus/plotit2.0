import { pgEnum } from 'drizzle-orm/pg-core';
import type { RoleConfig } from '@/entities/user/user.types';

// // Valid user roles
// Valid user roles
export const VALID_USER_ROLES = ['admin', 'user'] as const;

// Sortable user fields
export const sortableUserFields = [
  'id',
  'email',
  'firstName',
  'lastName',
  'role',
  'dateOfBirth',
  'createdAt',
  'updatedAt',
  'lastLoginAt',
  'phoneNumber',
  'profilePicture',
  'primaryLanguage',
  'gender',
] as const;

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  admin: {
    profileSpecificSortFields: [],
    defaultSortField: 'createdAt',
    findByUserIdMethod: 'findOne',
  },
  user: {
    profileSpecificSortFields: [],
    defaultSortField: 'createdAt',
    findByUserIdMethod: 'findOne',
  },
};

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);
