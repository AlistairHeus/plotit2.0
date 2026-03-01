import {
  universeQuerySchema,
  updateUniverseSchema
} from "@/entities/universe/universe.validation";
import { z } from "zod";
import type { Character } from "../character/character.types";
import type { FantasyMap } from "../map/map.types";
import type { Race } from "../race/race.types";
import type { Region } from "../region/region.types";
import type { Construct } from "../construct/construct.types";
import type { Galaxy } from "../celestial/celestial.types";
import type { Religion } from "../religion/religion.types";

export interface Universe {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UniverseWithRelations extends Universe {
  characters: Pick<Character, 'id'>[];
  regions: Pick<Region, 'id'>[];
  maps: Pick<FantasyMap, 'id'>[];
  races: Pick<Race, 'id'>[];
  constructs: Pick<Construct, 'id'>[];
  galaxies: Pick<Galaxy, 'id'>[];
  religions: Pick<Religion, 'id'>[];
  rootOfPower: {
    id: string;
    powerSystems: {
      id: string;
      subSystems: {
        id: string;
        categories: {
          id: string;
        }[];
      }[];
    }[];
  }[];
}

export interface CreateUniverse {
  name: string;
  description?: string | null | undefined;
  userId: string;
}
export type UpdateUniverse = z.infer<typeof updateUniverseSchema>;
export type UniverseQueryParams = z.infer<typeof universeQuerySchema>;
