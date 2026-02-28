import { z } from "zod";
import type { Universe } from "@/entities/universe/universe.types";
import {
  createRaceSchema,
  updateRaceSchema,
  raceQuerySchema,
  createEthnicGroupSchema,
  updateEthnicGroupSchema,
} from "@/entities/race/race.validation";

export interface Race {
  id: string;
  universeId: string;
  name: string;
  description: string | null;
  lifespan: string | null;
  languages: string[] | null;
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface EthnicGroup {
  id: string;
  raceId: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RaceWithRelations extends Race {
  universe: Universe;
  ethnicGroups: EthnicGroup[];
}

export type CreateRace = z.infer<typeof createRaceSchema>;
export type UpdateRace = z.infer<typeof updateRaceSchema>;
export type RaceQueryParams = z.infer<typeof raceQuerySchema>;
export type CreateEthnicGroup = z.infer<typeof createEthnicGroupSchema>;
export type UpdateEthnicGroup = z.infer<typeof updateEthnicGroupSchema>;
