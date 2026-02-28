import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableMapFields } from "@/entities/map/map.constants";

export const gridSettingsSchema = z.object({
    enabled: z.boolean().default(true),
    size: z.number().positive(),
    scale: z.number().positive().default(1.0),
    width: z.number().positive().nullable().optional(),
    height: z.number().positive().nullable().optional(),
    hexWidth: z.number().positive().nullable().optional(),
    hexHeight: z.number().positive().nullable().optional(),
    horizontalSpacing: z.number().positive().nullable().optional(),
    verticalSpacing: z.number().positive().nullable().optional(),
});

export const mapOverlaySchema = z.object({
    regionId: z.string().uuid(),
    zIndex: z.number().default(0),
    opacity: z.number().min(0).max(1).default(1),
    visible: z.boolean().default(true),
    bounds: z.unknown().optional(),
});

export const gridCellDataSchema = z.object({
    terrainType: z.string().optional(),
    features: z.array(z.any()).optional(),
    elevation: z.number().optional(),
    regionId: z.string().uuid().optional(),
}).catchall(z.any());

export const createMapSchema = z.object({
    name: z.string().min(1),
    universeId: z.string().uuid(),
    regionId: z.string().uuid(),
    imageUrl: z.string().url().optional(), // Expected to be provided by the server after image upload
    viewBox: z.string().nullable().optional(),
    gridSettings: gridSettingsSchema.optional(),
    mapOverlays: z.array(mapOverlaySchema).optional(),
    cellData: z.record(gridCellDataSchema).optional(),
});

export const updateMapSchema = z.object({
    name: z.string().min(1).optional(),
    universeId: z.string().uuid().optional(),
    regionId: z.string().uuid().optional(),
    imageUrl: z.string().url().optional(),
    viewBox: z.string().nullable().optional(),
    gridSettings: gridSettingsSchema.optional(),
    mapOverlays: z.array(mapOverlaySchema).optional(),
    cellData: z.record(gridCellDataSchema).optional(),
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

export const gridSetupSchema = gridSettingsSchema.partial();
export const gridCellUpdateSchema = gridCellDataSchema;

export const cellUpdateWrapperSchema = z.object({
    key: z.string(),
    data: gridCellDataSchema,
});

export const svgMappingSchema = z.object({
    mapId: z.string().uuid(),
    svgElementId: z.string().min(1),
    featureType: z.string().min(1),
    regionId: z.string().uuid(),
});
