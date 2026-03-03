import { z } from "zod";
import { createPaginatedQuerySchema, zodFormArray } from "@/common/validation.utils";
import { sortableCharacterFields, CHARACTER_TYPES, CHARACTER_GENDERS } from "@/entities/character/character.constants";

export const createCharacterSchema = z.object({
    universeId: z.string().uuid(),
    raceId: z.string().uuid().nullable().optional(),
    ethnicGroupId: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(255),
    background: z.string().nullable().optional(),
    type: z.enum(CHARACTER_TYPES).nullable().optional(),
    gender: z.enum(CHARACTER_GENDERS).default("Unspecified"),
    age: z.number().int().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
    benched: z.boolean().default(false).optional(),
});

export const updateCharacterSchema = createCharacterSchema.partial().omit({ universeId: true });

export const characterQuerySchema = createPaginatedQuerySchema(
    sortableCharacterFields,
    "updatedAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
        raceId: z.string().uuid().optional(),
        type: z.enum(CHARACTER_TYPES).optional(),
        benched: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : undefined, z.boolean()).optional(),
    },
);
