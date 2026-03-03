import { z } from "zod";
import type { Universe } from "@/entities/universe/universe.types";
import {
  createCharacterSchema,
  updateCharacterSchema,
  characterQuerySchema,
} from "@/entities/character/character.validation";
import type { Race, EthnicGroup } from "@/entities/race/race.types";

export interface Character {
  id: string;
  universeId: string;
  raceId: string | null;
  ethnicGroupId: string | null;
  name: string;
  background: string | null;
  type: string | null;
  gender: string | null;
  age: number | null;
  avatarUrl: string | null;
  imageUrls: string[];
  benched: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CharacterWithRelations extends Character {
  universe: Universe;
  race?: Race | null;
  ethnicGroup?: EthnicGroup | null;
}

export type CreateCharacter = z.infer<typeof createCharacterSchema>;
export type UpdateCharacter = z.infer<typeof updateCharacterSchema>;
export type CharacterQueryParams = z.infer<typeof characterQuerySchema>;
