import { z } from "zod";
import { createPaginatedQuerySchema, zodFormArray } from "@/common/validation.utils";
import { sortableConstructFields } from "@/entities/construct/construct.constants";
import { ConstructCategory } from "@/entities/construct/construct.types";

export const createConstructSchema = z.object({
    name: z.string().min(1),
    universeId: z.string().uuid(),
    category: z.nativeEnum(ConstructCategory),
    description: z.string().nullable().optional(),
    rarity: z.string().nullable().optional(),
    tags: z.array(z.string()).optional().default([]),
    properties: z.record(z.any()).nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateConstructSchema = createConstructSchema
    .partial()
    .omit({ universeId: true });

export const constructQuerySchema = createPaginatedQuerySchema(
    sortableConstructFields,
    "updatedAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
        category: z.nativeEnum(ConstructCategory).optional(),
        rarity: z.string().optional(),
    },
);
