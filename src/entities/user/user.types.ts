import {
  updateUserSchema,
  userQuerySchema,
  createUserSchema,
} from "@/entities/user/user.validation";
import { z } from "zod";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastLoginAt: Date | null;
}

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
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
