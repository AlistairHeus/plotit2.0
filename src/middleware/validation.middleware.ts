import { ValidationError } from "@/common/error.types";
import { z } from "zod";

interface ValidationSchema<T> {
  parse(data: unknown): T;
}

export function validateQuery<T>(data: unknown, schema: ValidationSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw error;
  }
}

export function validateParams<T>(data: unknown, schema: ValidationSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw error;
  }
}

export function validateBody<T>(data: unknown, schema: ValidationSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw error;
  }
}
