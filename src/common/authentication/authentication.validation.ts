import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const jwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
