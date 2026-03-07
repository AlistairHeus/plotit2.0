import type { Character } from "@/entities/character/character.types";
import {
  createFactionSchema,
  factionQuerySchema,
  updateFactionSchema,
} from "@/entities/faction/faction.validation";
import type { Region } from "@/entities/region/region.types";
import type { Universe } from "@/entities/universe/universe.types";
import { z } from "zod";

export const FactionType = {
  GUILD: "GUILD",
  GOVERNMENT: "GOVERNMENT",
  MILITARY: "MILITARY",
  FAMILY: "FAMILY",
} as const;

export type FactionType = (typeof FactionType)[keyof typeof FactionType];

export interface Faction {
  id: string;
  name: string;
  description: string | null;
  universeId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: FactionType;
  headquartersId: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
}

export interface FactionMember {
  id: string;
  factionId: string;
  characterId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FactionMemberWithRelations extends FactionMember {
  faction?: Faction;
  character?: Character;
}

export interface FactionWithRelations extends Faction {
  universe: Universe;
  headquarters: Region | null;
  parent: Faction | null;
  subFactions: Faction[];
  members: FactionMemberWithRelations[];
}

export type CreateFaction = z.infer<typeof createFactionSchema>;
export type UpdateFaction = z.infer<typeof updateFactionSchema>;
export type FactionQueryParams = z.infer<typeof factionQuerySchema>;
