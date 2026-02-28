import { z } from "zod";
import type { users } from "@/entities/user/user.schema";
import { userQuerySchema } from "@/entities/user/user.validation";

export type User = typeof users.$inferSelect;

export type CreateUser = typeof users.$inferInsert;
export type UpdateUser = Partial<typeof users.$inferInsert>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;

export type SafeUser = Omit<User, "password" | "lastLoginAt">;

export type AuthenticatedUser = Omit<
  SafeUser,
  "createdAt" | "updatedAt" | "firstName" | "lastName"
>;

export interface UserDTO {
  user: SafeUser;
}

// Base interface that all role query params should extend
export interface BaseQueryParams {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
