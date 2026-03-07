import { z } from "zod";
import {
  createPaginatedQuerySchema,
  zodFormArray,
  zodFormUUID,
  zodFormString,
} from "@/common/validation.utils";
import { sortableFactionFields } from "@/entities/faction/faction.constants";
import { FactionType } from "@/entities/faction/faction.types";

export const createFactionSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  type: z.nativeEnum(FactionType),
  description: z.string().nullable().optional(),
  parentId: zodFormUUID(z.string().uuid().nullable().optional()),
  headquartersId: zodFormUUID(z.string().uuid().nullable().optional()),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateFactionSchema = createFactionSchema
  .partial()
  .omit({ universeId: true });

export const factionQuerySchema = createPaginatedQuerySchema(
  sortableFactionFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
    headquartersId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional(),
    type: z.nativeEnum(FactionType).optional(),
  },
);
