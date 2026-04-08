import { z } from "zod";
import {
  createPaginatedQuerySchema,
  zodFormArray,
  zodFormUUID,
  zodFormString,
  zodFormBoolean,
} from "@/common/validation.utils";
import { sortableRegionFields } from "@/entities/region/region.constants";
import { RegionType } from "@/entities/region/region.types";

export const createRegionSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  type: z.nativeEnum(RegionType),
  description: z.string().nullable().optional(),
  parentId: zodFormUUID(z.string().uuid().nullable().optional()),
  planetId: zodFormUUID(z.string().uuid().nullable().optional()),
  religionId: zodFormUUID(z.string().uuid().nullable().optional()),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateRegionSchema = createRegionSchema
  .partial()
  .omit({ universeId: true });

// entities/region/region.validation.ts

export const regionQuerySchema = createPaginatedQuerySchema(
  sortableRegionFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
    planetId: zodFormUUID(z.string().uuid().optional()), // Use your UUID helper
    parentId: zodFormUUID(z.string().uuid().optional()),
    religionId: zodFormUUID(z.string().uuid().optional()), // Added this
    type: z.nativeEnum(RegionType).optional(),

    // --- Smart AI Filters (Matches Repository logic) ---
    universeName: z.string().optional(),
    planetName: z.string().optional(),
    religionName: z.string().optional(),
    parentName: z.string().optional(),

    // --- UI/Agent Control ---
    lean: zodFormBoolean(z.boolean().optional()),
  },
);