import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableMapFields } from "@/entities/map/map.constants";

export const createMapSchema = z.object({
    name: z.string().min(1),
    universeId: z.string().uuid(),
    regionId: z.string().uuid(),
    imageUrl: z.string().url().optional(), // Provided by the server after image upload
});

export const updateMapSchema = z.object({
    name: z.string().min(1).optional(),
    universeId: z.string().uuid().optional(),
    regionId: z.string().uuid().optional(),
    imageUrl: z.string().url().optional(),
});

export const mapQuerySchema = createPaginatedQuerySchema(
    sortableMapFields,
    "createdAt",
    {
        name: z.string().optional(),
        universeId: z.string().uuid().optional(),
        regionId: z.string().uuid().optional(),
    }
);

export const svgMappingSchema = z.object({
    mapId: z.string().uuid(),
    svgElementId: z.string().min(1),
    featureType: z.string().min(1),
    regionId: z.string().uuid(),
});
