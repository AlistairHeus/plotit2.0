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
export const zodFormBoolean = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => {
  if (val === 'null' || val === 'undefined') return null;
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
export const zodFormNumber = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => {
  if (val === 'null' || val === 'undefined') return null;
  if (val === '' || val === undefined) return undefined;
  if (typeof val === 'string') {
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }
  return val;
}, schema);

/**
 * Helper to handle UUID strings that might be "null" or empty from multipart/form-data.
 */
export const zodFormUUID = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => {
  if (val === 'null' || val === 'undefined' || val === '') return null;
  return val;
}, schema);

/**
 * Helper for generic strings that might be "null" or empty.
 */
export const zodFormString = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => {
  if (val === 'null' || val === 'undefined' || val === '') return null;
  return val;
}, schema);

/**
 * Helper to handle arrays in multipart/form-data.
 * Multer returns a string if only one item is provided, and an array if multiple.
 * This preprocessor ensures it's always an array.
 */
export const zodFormArray = <T extends z.ZodTypeAny>(schema: z.ZodArray<T>) => z.preprocess((val) => {
  if (!val || val === '' || val === 'null' || val === 'undefined') return [];
  if (typeof val === 'string') return [val];
  return val;
}, schema);
