import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableRegionFields } from "@/entities/region/region.constants";
import { RegionType, RegionFeatureType, RegionClimate } from "@/entities/region/region.types";

export const createRegionSchema = z.object({
    name: z.string().min(1),
    universeId: z.string().uuid(),
    type: z.nativeEnum(RegionType),
    description: z.string().nullable().optional(),
    parentId: z.string().uuid().nullable().optional(),
    planetId: z.string().uuid().nullable().optional(),
    features: z.array(z.nativeEnum(RegionFeatureType)).optional(),
    area: z.number().nullable().optional(),
    boundaries: z.unknown().nullable().optional(), // Expected valid JSON
    capital: z.string().nullable().optional(),
    coastlineLength: z.number().nullable().optional(),
    coordinates: z.unknown().nullable().optional(), // Expected valid JSON
    culture: z.string().nullable().optional(),
    elevation: z.number().nullable().optional(),
    government: z.string().nullable().optional(),
    language: z.array(z.string()).optional(),
    population: z.number().int().nullable().optional(),
    religionId: z.string().uuid().nullable().optional(),
    rainfall: z.number().nullable().optional(),
    temperature: z.number().nullable().optional(),
    waterBodies: z.number().int().nullable().optional(),
    climate: z.nativeEnum(RegionClimate).nullable().optional(),
    resources: z.array(z.string()).optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: z.array(z.string().url()).optional(),
});

export const updateRegionSchema = createRegionSchema
    .partial()
    .omit({ universeId: true }); // typically shouldn't switch universes? If allowed, remove omit. Let's keep it omit for safety, or just partial.
// Wait, looking at universe update, it's just partial. Let's make it partial.

export const regionQuerySchema = createPaginatedQuerySchema(
    sortableRegionFields,
    "createdAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
        planetId: z.string().uuid().optional(),
        parentId: z.string().uuid().optional(),
        type: z.nativeEnum(RegionType).optional(),
        climate: z.nativeEnum(RegionClimate).optional(),
    },
);
