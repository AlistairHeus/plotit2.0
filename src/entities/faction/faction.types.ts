import type { Character } from "@/entities/character/character.types";
import type { Universe } from "@/entities/universe/universe.types";
import type { z } from "zod";
import type {
  createFactionSchema,
  updateFactionSchema,
  factionQuerySchema,
  createRelationshipSchema,
  updateRelationshipSchema,
  relationshipQuerySchema,
} from "@/entities/faction/faction.validation";

// ─── Faction ──────────────────────────────────────────────────────────────────

export interface Faction {
  id: string;
  name: string;
  description: string | null;
  universeId: string;
  type: "GUILD" | "GOVERNMENT" | "MILITARY" | "FAMILY";
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FactionWithRelations extends Faction {
  universe: Universe;
  relationships: CharacterRelationship[];
}

// ─── Character Relationships ──────────────────────────────────────────────────

export type RelationshipType = "SPOUSE" | "PARENT_OF" | "SIBLING_OF" | "REPORTS_TO";

export interface CharacterRelationship {
  id: string;
  universeId: string;
  factionId: string | null;
  sourceCharacterId: string;
  targetCharacterId: string;
  type: RelationshipType;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterRelationshipWithCharacters extends CharacterRelationship {
  source: Character;
  target: Character;
  faction: Faction | null;
}

// A faction's "members" derived from its relationships
export interface FactionTree {
  faction: Faction;
  relationships: CharacterRelationshipWithCharacters[];
  /** All unique characters involved in this faction's relationships */
  characters: Character[];
}

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateFaction = z.infer<typeof createFactionSchema>;
export type UpdateFaction = z.infer<typeof updateFactionSchema>;
export type FactionQueryParams = z.infer<typeof factionQuerySchema>;
export type CreateRelationship = z.infer<typeof createRelationshipSchema>;
export type UpdateRelationship = z.infer<typeof updateRelationshipSchema>;
export type RelationshipQueryParams = z.infer<typeof relationshipQuerySchema>;
