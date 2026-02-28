import { z } from "zod";
import type { Planet } from "@/entities/celestial/celestial.types";
import type { Religion } from "@/entities/religion/religion.types";
import type { Universe } from "@/entities/universe/universe.types";
import {
  createRegionSchema,
  regionQuerySchema,
  updateRegionSchema,
} from "@/entities/region/region.validation";

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
export interface RegionWithRelations extends Region {
  universe: Universe;
  planet: Planet | null;
  religion: Religion | null;
  parent: Region | null;
  subRegions: Region[];
}

export type CreateRegion = z.infer<typeof createRegionSchema>;
export type UpdateRegion = z.infer<typeof updateRegionSchema>;
export type RegionQueryParams = z.infer<typeof regionQuerySchema>;
