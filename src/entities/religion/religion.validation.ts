import { z } from "zod";
import {
  createPaginatedQuerySchema,
  zodFormArray,
  zodFormString,
} from "@/common/validation.utils";
import { sortableReligionFields } from "@/entities/religion/religion.constants";
export const createReligionSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  description: z.string().nullable().optional(),
  deities: zodFormArray(z.array(z.string())).optional(),
  holySites: zodFormArray(z.array(z.string())).optional(),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateReligionSchema = createReligionSchema
  .partial()
  .omit({ universeId: true });

export const religionQuerySchema = createPaginatedQuerySchema(
  sortableReligionFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
  },
);
