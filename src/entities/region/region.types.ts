export const RegionType = {
  CONTINENT: "CONTINENT",
  OCEAN: "OCEAN",
  SEA: "SEA",
  LAKE: "LAKE",
  STATE: "STATE",
  CITY: "CITY",
  MOUNTAIN_RANGE: "MOUNTAIN_RANGE",
  FOREST: "FOREST",
  DESERT: "DESERT",
  ISLAND: "ISLAND",
  VALLEY: "VALLEY",
  RIVER: "RIVER",
} as const;

export type RegionType = (typeof RegionType)[keyof typeof RegionType];

export const RegionFeatureType = {
  MOUNTAIN: "MOUNTAIN",
  HILL: "HILL",
  FOREST: "FOREST",
  DESERT: "DESERT",
  WATER: "WATER",
  GRASSLAND: "GRASSLAND",
  SETTLEMENT: "SETTLEMENT",
  LANDMARK: "LANDMARK",
  CUSTOM: "CUSTOM",
} as const;

export type RegionFeatureType =
  (typeof RegionFeatureType)[keyof typeof RegionFeatureType];

export const RegionClimate = {
  TROPICAL: "TROPICAL",
  SUBTROPICAL: "SUBTROPICAL",
  TEMPERATE: "TEMPERATE",
  SUBARCTIC: "SUBARCTIC",
  ARCTIC: "ARCTIC",
  DESERT: "DESERT",
  MEDITERRANEAN: "MEDITERRANEAN",
  OCEANIC: "OCEANIC",
  CONTINENTAL: "CONTINENTAL",
  ALPINE: "ALPINE",
  CUSTOM: "CUSTOM",
} as const;

export type RegionClimate = (typeof RegionClimate)[keyof typeof RegionClimate];

export interface Region {
  id: string;
  name: string;
  description: string | null;
  universeId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: RegionType;
  features: RegionFeatureType[];
  planetId: string | null;
  area: number | null;
  boundaries: unknown; // Json (null is included in unknown)
  capital: string | null;
  coastlineLength: number | null;
  coordinates: unknown; // Json (null is included in unknown)
  culture: string | null;
  elevation: number | null;
  government: string | null;
  language: string[];
  population: number | null;
  religionId: string | null;
  rainfall: number | null;
  temperature: number | null;
  waterBodies: number | null;
  climate: RegionClimate | null;
  resources: string[];
  avatarUrl: string | null;
  imageUrls: string[];
}

export interface CreateRegionRequest {
  name: string;
  universeId: string;
  type: RegionType;
  description?: string;
  parentId?: string;
  planetId?: string;
  features?: RegionFeatureType[];
  area?: number;
  boundaries?: unknown;
  capital?: string;
  coastlineLength?: number;
  coordinates?: unknown;
  culture?: string;
  elevation?: number;
  government?: string;
  language?: string[];
  population?: number;
  religionId?: string;
  rainfall?: number;
  temperature?: number;
  waterBodies?: number;
  climate?: RegionClimate;
  resources?: string[];
  avatarUrl?: string;
  imageUrls?: string[];
}
