import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableUniverseFields } from "@/entities/universe/universe.constants";

export const createUniverseSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  userId: z.string().uuid(),
});

export const updateUniverseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
});

export const universeQuerySchema = createPaginatedQuerySchema(
  sortableUniverseFields,
  "createdAt",
  {
    name: z.string().optional(),
  },
);
