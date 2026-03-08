import { z } from "zod";
import {
  createPaginatedQuerySchema,
  zodFormArray,
  zodFormString,
} from "@/common/validation.utils";
import { sortableNatureFields } from "@/entities/nature/nature.constants";
import { NatureType } from "@/entities/nature/nature.types";

export const createNatureSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  type: z.nativeEnum(NatureType),
  description: z.string().nullable().optional(),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional().default([]),
});

export const updateNatureSchema = createNatureSchema
  .partial()
  .omit({ universeId: true });

export const natureQuerySchema = createPaginatedQuerySchema(
  sortableNatureFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
    type: z.nativeEnum(NatureType).optional(),
  },
);
