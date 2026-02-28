import {
  universeQuerySchema,
  updateUniverseSchema
} from "@/entities/universe/universe.validation";
import { z } from "zod";
import type { Character } from "../character/character.types";
import type { FantasyMap } from "../map/map.types";
import type { EthnicGroup, Race } from "../race/race.types";
import type { Region } from "../region/region.types";

export interface Universe {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UniverseWithRelations extends Universe {
  characters: (Character & { race: Race | null; ethnicGroup: EthnicGroup | null })[];
  regions: Region[];
  maps: FantasyMap[];
  races: Race[];
}

export interface CreateUniverse {
  name: string;
  description?: string | null | undefined;
  userId: string;
}
export type UpdateUniverse = z.infer<typeof updateUniverseSchema>;
export type UniverseQueryParams = z.infer<typeof universeQuerySchema>;
