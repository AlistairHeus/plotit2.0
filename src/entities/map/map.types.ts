import type { RegionFeatureType } from '../region/region.types';

export interface FantasyMap {
  id: string;
  name: string;
  universeId: string;
  regionId: string;
  imageUrl: string;
  gridEnabled: boolean;
  gridSize: number;
  gridScale: number;
  svgContent: string | null;
  viewBox: string | null;
  gridHeight: number | null;
  gridHexHeight: number | null;
  gridHexWidth: number | null;
  gridHorizontalSpacing: number | null;
  gridVerticalSpacing: number | null;
  gridWidth: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GridCell {
  id: string;
  mapId: string;
  row: number;
  col: number;
  regionId: string | null;
  terrainType: string | null;
  featureType: RegionFeatureType | null;
  elevation: number | null;
  pathData: string | null;
}

export interface MapRegion {
  id: string;
  mapId: string;
  regionId: string;
  zIndex: number;
  opacity: number;
  visible: boolean;
  boundsTop: number | null;
  boundsLeft: number | null;
  boundsRight: number | null;
  boundsBottom: number | null;
}

export interface GridCellFeature {
  id: string;
  gridCellId: string;
  featureType: RegionFeatureType;
  intensity: number;
}

export interface RegionSvgMapping {
  id: string;
  mapId: string;
  regionId: string;
  svgStateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMapRequest {
  name: string;
  universeId: string;
  regionId: string;
  imageUrl: string;
  gridEnabled?: boolean;
  gridSize?: number;
  gridScale?: number;
  svgContent?: string;
  viewBox?: string;
}
