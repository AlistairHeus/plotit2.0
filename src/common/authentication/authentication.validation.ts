import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

import { VALID_USER_ROLES } from '@/entities/user/user.constants';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const jwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(VALID_USER_ROLES),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
