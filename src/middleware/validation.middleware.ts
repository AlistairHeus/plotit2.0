import type { z } from 'zod/v4';
import { ValidationError } from '@/common/error.types';

export function validateQuery<T>(data: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ValidationError.fromZodError(result.error);
  }
  return result.data;
}

export function validateParams<T>(data: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ValidationError.fromZodError(result.error);
  }
  return result.data;
}

export function validateBody<T>(data: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ValidationError.fromZodError(result.error);
  }
  return result.data;
}
