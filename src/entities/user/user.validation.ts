import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableUserFields } from "@/entities/user/user.constants";

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

export const userQueryFilters = z.object({});

export const userQuerySchema = createPaginatedQuerySchema(
  sortableUserFields,
  "createdAt",
  userQueryFilters.shape,
);
