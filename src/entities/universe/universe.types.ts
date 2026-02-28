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

import type { universes } from "@/entities/universe/universe.schema";
import { z } from "zod";
import { universeQuerySchema } from "@/entities/universe/universe.validation";

export type CreateUniverse = typeof universes.$inferInsert;
export type UpdateUniverse = Partial<typeof universes.$inferInsert>;

export type UniverseQueryParams = z.infer<typeof universeQuerySchema>;
