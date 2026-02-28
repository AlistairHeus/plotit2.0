import type { RegionFeatureType } from "../region/region.types";

export interface GridSettings {
  enabled: boolean;
  size: number;
  scale: number;
  width?: number | null;
  height?: number | null;
  hexWidth?: number | null;
  hexHeight?: number | null;
  horizontalSpacing?: number | null;
  verticalSpacing?: number | null;
}

export interface MapOverlay {
  regionId: string;
  zIndex: number;
  opacity: number;
  visible: boolean;
  boundsTop?: number | null;
  boundsLeft?: number | null;
  boundsRight?: number | null;
  boundsBottom?: number | null;
}

export interface SvgMapping {
  svgStateId: string;
  regionId: string;
}

export interface GridCellData {
  regionId: string | null;
  terrainType: string | null;
  featureType: RegionFeatureType | null;
  elevation: number | null;
  pathData: string | null;
  features: { type: RegionFeatureType; intensity: number }[];
}

export interface FantasyMap {
  id: string;
  name: string;
  universeId: string;
  regionId: string;
  imageUrl: string;
  svgContent: string | null;
  viewBox: string | null;
  gridSettings: GridSettings;
  mapOverlays: MapOverlay[];
  svgMappings: SvgMapping[];
  cellData: Record<string, GridCellData>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMapRequest {
  name: string;
  universeId: string;
  regionId: string;
  imageUrl: string;
  svgContent?: string;
  viewBox?: string;
  gridSettings?: Partial<GridSettings>;
}
