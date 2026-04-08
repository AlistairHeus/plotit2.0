import { z } from "zod";
import type { Planet } from "@/entities/celestial/celestial.types";
import type { Religion } from "@/entities/religion/religion.types";
import type { Universe } from "@/entities/universe/universe.types";
import type { FantasyMap, SvgMapping } from "@/entities/map/map.types";
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

export interface Region {
  id: string;
  name: string;
  description: string | null;
  universeId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: RegionType;
  planetId: string | null;
  religionId: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
}
export interface RegionWithRelations extends Region {
  universe: Universe;
  planet: Planet | null;
  religion: Religion | null;
  parent: Region | null;
  subRegions: Region[];
  maps: FantasyMap[];
  svgMappings: SvgMapping[];
}

export interface RegionWithRelationsLean {
  id: string;
  name: string;
  description: string | null;
  type: RegionType;
  universe: { name: string; description: string | null };
  planet: { name: string; description: string | null } | null;
  parent: { name: string, type: RegionType } | null;
}

export type CreateRegion = z.infer<typeof createRegionSchema>;
export type UpdateRegion = z.infer<typeof updateRegionSchema>;
export type RegionQueryParams = z.infer<typeof regionQuerySchema>;
