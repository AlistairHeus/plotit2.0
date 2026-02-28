import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableUniverseFields } from "@/entities/universe/universe.constants";
import { universes } from "@/entities/universe/universe.schema";

export const createUniverseSchema = createInsertSchema(universes);
export const updateUniverseSchema = createUpdateSchema(universes);
export const selectUniverseSchema = createSelectSchema(universes);

export const universeQuerySchema = createPaginatedQuerySchema(
  sortableUniverseFields,
  "createdAt",
  {
    name: z.string().optional(),
  },
);
