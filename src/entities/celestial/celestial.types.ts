import type { PaginationParams } from "@/common/pagination/pagination.types";
import type { Universe } from "@/entities/universe/universe.types";
import type { Region } from "@/entities/region/region.types";

export const GalaxyType = {
  SPIRAL: "SPIRAL",
  BARRED_SPIRAL: "BARRED_SPIRAL",
  ELLIPTICAL: "ELLIPTICAL",
  IRREGULAR: "IRREGULAR",
  LENTICULAR: "LENTICULAR",
  RING: "RING",
  DWARF: "DWARF",
} as const;

export type GalaxyType = (typeof GalaxyType)[keyof typeof GalaxyType];

export const SpectralType = {
  HOT_BLUE_STAR: "HOT_BLUE_STAR",
  BLUE_WHITE_STAR: "BLUE_WHITE_STAR",
  WHITE_STAR: "WHITE_STAR",
  YELLOW_WHITE_STAR: "YELLOW_WHITE_STAR",
  YELLOW_STAR: "YELLOW_STAR",
  ORANGE_STAR: "ORANGE_STAR",
  RED_STAR: "RED_STAR",
  LUMINOUS_RED_GIANT: "LUMINOUS_RED_GIANT",
  SUPER_GIANT: "SUPER_GIANT",
  WHITE_DWARF: "WHITE_DWARF",
  NEUTRON_STAR: "NEUTRON_STAR",
  BLACK_HOLE: "BLACK_HOLE",
  UNKNOWN: "UNKNOWN",
} as const;

export type SpectralType = (typeof SpectralType)[keyof typeof SpectralType];

// --- GALAXY ---

export interface Galaxy {
  id: string;
  universeId: string;
  name: string;
  description: string | null;
  type: GalaxyType;
  color: string | null;
  avatarUrl: string | null;
  imageUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalaxy {
  universeId: string;
  name: string;
  description?: string | null | undefined;
  type?: GalaxyType | undefined;
  color?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface UpdateGalaxy {
  name?: string | undefined;
  description?: string | null | undefined;
  type?: GalaxyType | undefined;
  color?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface GalaxyQueryParams extends PaginationParams {
  universeId?: string | undefined;
  name?: string | undefined;
  type?: GalaxyType | undefined;
}

export interface GalaxyWithRelations extends Galaxy {
  universe?: Universe;
  solarSystems?: SolarSystem[];
}

// --- SOLAR SYSTEM ---

export interface SolarSystem {
  id: string;
  galaxyId: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  imageUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSolarSystem {
  galaxyId: string;
  name: string;
  description?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface UpdateSolarSystem {
  name?: string | undefined;
  description?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface SolarSystemQueryParams extends PaginationParams {
  galaxyId?: string | undefined;
  name?: string | undefined;
}

export interface SolarSystemWithRelations extends SolarSystem {
  galaxy?: Galaxy;
  stars?: Star[];
  planets?: Planet[];
}

// --- STAR ---

export interface Star {
  id: string;
  systemId: string;
  name: string;
  description: string | null;
  type: SpectralType;
  avatarUrl: string | null;
  imageUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStar {
  systemId: string;
  name: string;
  description?: string | null | undefined;
  type?: SpectralType | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface UpdateStar {
  name?: string | undefined;
  description?: string | null | undefined;
  type?: SpectralType | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface StarQueryParams extends PaginationParams {
  systemId?: string | undefined;
  name?: string | undefined;
  type?: SpectralType | undefined;
}

export interface StarWithRelations extends Star {
  solarSystem?: SolarSystem;
}

// --- PLANET ---

export interface Planet {
  id: string;
  systemId: string;
  parentPlanetId: string | null;
  name: string;
  description: string | null;
  color: string | null;
  isHabitable: boolean;
  avatarUrl: string | null;
  imageUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlanet {
  systemId: string;
  parentPlanetId?: string | null | undefined;
  name: string;
  description?: string | null | undefined;
  color?: string | null | undefined;
  isHabitable?: boolean | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface UpdatePlanet {
  parentPlanetId?: string | null | undefined;
  name?: string | undefined;
  description?: string | null | undefined;
  color?: string | null | undefined;
  isHabitable?: boolean | undefined;
  avatarUrl?: string | null | undefined;
  imageUrls?: string[] | null | undefined;
}

export interface PlanetQueryParams extends PaginationParams {
  systemId?: string | undefined;
  parentPlanetId?: string | undefined;
  name?: string | undefined;
  isHabitable?: boolean | undefined;
}

export interface PlanetWithRelations extends Planet {
  solarSystem?: SolarSystem;
  parentPlanet?: Planet | null;
  moons?: Planet[];
  regions?: Region[];
}
