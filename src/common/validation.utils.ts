import { z } from "zod";
import { paginationQuerySchema } from "@/common/common.validation";

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
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  };

  const extendedSchema = baseSchema.extend(schemaShape);

  if (additionalFilters) {
    return extendedSchema.extend(additionalFilters);
  }

  return extendedSchema;
}

/**
 * Helper to handle booleans in multipart/form-data.
 * Multer returns strings "true" or "false".
 */
export const zodFormBoolean = (schema: z.ZodTypeAny = z.boolean()) => z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
  }
  return val;
}, schema);

/**
 * Helper to handle numbers in multipart/form-data.
 * Multer returns strings that need to be coerced to numbers.
 */
export const zodFormNumber = (schema: z.ZodTypeAny = z.number()) => z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }
  return val;
}, schema);

/**
 * Helper to handle arrays in multipart/form-data.
 * Multer returns a string if only one item is provided, and an array if multiple.
 * This preprocessor ensures it's always an array.
 */
export const zodFormArray = <T extends z.ZodTypeAny>(schema: z.ZodArray<T>) => z.preprocess((val) => {
  if (!val || val === '') return [];
  if (typeof val === 'string') return [val];
  return val;
}, schema);
