import {
  createPaginatedQuerySchema,
  zodFormArray,
  zodFormBoolean,
  zodFormNumber,
  zodFormUUID,
  zodFormString,
} from "@/common/validation.utils";
import {
  CHARACTER_GENDERS,
  CHARACTER_TYPES,
  sortableCharacterFields,
} from "@/entities/character/character.constants";
import { z } from "zod";

export const createCharacterSchema = z.object({
  universeId: z.string().uuid(),
  raceId: zodFormUUID(z.string().uuid().nullable().optional()),
  ethnicGroupId: zodFormUUID(z.string().uuid().nullable().optional()),
  name: z.string().min(1).max(255),
  background: z.string().nullable().optional(),
  type: z.enum(CHARACTER_TYPES).nullable().optional(),
  gender: z.enum(CHARACTER_GENDERS).default("Unspecified"),
  age: zodFormNumber(z.number().int().nullable().optional()),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional(),
  benched: zodFormBoolean(z.boolean().default(false).optional()),
});

export const updateCharacterSchema = createCharacterSchema
  .partial()
  .omit({ universeId: true });

export const characterQuerySchema = createPaginatedQuerySchema(
  sortableCharacterFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
    raceId: zodFormUUID(z.string().uuid().optional()),
    type: z.enum(CHARACTER_TYPES).optional(),
    benched: zodFormBoolean(z.boolean().optional()),
    universeName: z.string().optional(), // New
    raceName: z.string().optional(),     // New: "Arboreal"
    minAge: zodFormNumber(z.number().optional()), // New
    maxAge: zodFormNumber(z.number().optional()), // New
    gender: z.enum(CHARACTER_GENDERS).optional(),
    lean: zodFormBoolean(z.boolean().optional()),
  },
);

export const characterPowerAccessSchema = z.object({
  powerSystemId: zodFormUUID(z.string().uuid().nullable().optional()),
  subSystemId: zodFormUUID(z.string().uuid().nullable().optional()),
  categoryId: zodFormUUID(z.string().uuid().nullable().optional()),
  abilityId: zodFormUUID(z.string().uuid().nullable().optional()),
});

export const syncCharacterPowerAccessSchema = z.object({
  powers: z.array(characterPowerAccessSchema),
});
