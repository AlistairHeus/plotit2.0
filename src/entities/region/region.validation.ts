import { z } from "zod";
import { createPaginatedQuerySchema, zodFormArray } from "@/common/validation.utils";
import { sortableRegionFields } from "@/entities/region/region.constants";
import { RegionType, } from "@/entities/region/region.types";

export const createRegionSchema = z.object({
    name: z.string().min(1),
    universeId: z.string().uuid(),
    type: z.nativeEnum(RegionType),
    description: z.string().nullable().optional(),
    parentId: z.string().uuid().nullable().optional(),
    planetId: z.string().uuid().nullable().optional(),
    religionId: z.string().uuid().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateRegionSchema = createRegionSchema
    .partial()
    .omit({ universeId: true });

export const regionQuerySchema = createPaginatedQuerySchema(
    sortableRegionFields,
    "updatedAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
        planetId: z.string().uuid().optional(),
        parentId: z.string().uuid().optional(),
        type: z.nativeEnum(RegionType).optional(),
    },
);
