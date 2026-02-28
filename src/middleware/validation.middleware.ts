import { ValidationError } from "@/common/error.types";
import { z } from "zod";

interface ValidationSchema<T> {
  parse(data: unknown): T;
}

function validate<T>(data: unknown, schema: ValidationSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw error;
  }
}

export const validateQuery = <T>(data: unknown, schema: ValidationSchema<T>): T =>
  validate(data, schema);

export const validateParams = <T>(data: unknown, schema: ValidationSchema<T>): T =>
  validate(data, schema);

export const validateBody = <T>(data: unknown, schema: ValidationSchema<T>): T =>
  validate(data, schema);
