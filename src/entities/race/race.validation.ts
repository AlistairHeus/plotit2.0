import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableRaceFields } from "@/entities/race/race.constants";

export const createRaceSchema = z.object({
    universeId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    lifespan: z.string().nullable().optional(),
    languages: z.array(z.string()).nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: z.array(z.string().url()).optional(),
});

export const updateRaceSchema = createRaceSchema.partial().omit({ universeId: true });

export const raceQuerySchema = createPaginatedQuerySchema(
    sortableRaceFields,
    "createdAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
    },
);

// Ethnic Group schemas
export const createEthnicGroupSchema = z.object({
    raceId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: z.array(z.string().url()).optional(),
});

export const updateEthnicGroupSchema = createEthnicGroupSchema.partial().omit({ raceId: true });
