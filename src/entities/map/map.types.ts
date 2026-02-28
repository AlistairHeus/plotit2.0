import { z } from "zod";
import type { Universe } from "@/entities/universe/universe.types";
import type { Region } from "@/entities/region/region.types";
import {
    createMapSchema,
    updateMapSchema,
    mapQuerySchema,
    gridSettingsSchema,
    mapOverlaySchema,
    gridCellDataSchema,
    svgMappingSchema,
    gridSetupSchema,
} from "@/entities/map/map.validation";

export type GridSettings = z.infer<typeof gridSettingsSchema>;
export type GridSetupData = z.infer<typeof gridSetupSchema>;
export type PartialGridSettings = Partial<GridSettings>;
export type MapOverlay = z.infer<typeof mapOverlaySchema>;
export type GridCellData = z.infer<typeof gridCellDataSchema>;

export interface FantasyMap {
    id: string;
    name: string;
    universeId: string;
    regionId: string;
    imageUrl: string;
    viewBox: string | null;
    gridSettings: GridSettings;
    mapOverlays: MapOverlay[];
    cellData: Record<string, GridCellData>;
    createdAt: Date;
    updatedAt: Date;
}

export interface SvgMapping {
    id: string;
    mapId: string;
    svgElementId: string;
    featureType: string;
    regionId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MapWithRelations extends FantasyMap {
    universe: Universe;
    region: Region;
    svgMappings: SvgMapping[];
}

export type CreateMap = z.infer<typeof createMapSchema>;
export type UpdateMap = z.infer<typeof updateMapSchema>;
export type MapQueryParams = z.infer<typeof mapQuerySchema>;
export type CreateSvgMapping = z.infer<typeof svgMappingSchema>;
