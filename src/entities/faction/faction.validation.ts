import { z } from "zod";
import { zodFormArray, zodFormString } from "@/common/validation.utils";
import { paginationQuerySchema } from "@/common/common.validation";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const RelationshipType = {
  SPOUSE: "SPOUSE",
  PARENT_OF: "PARENT_OF",
  SIBLING_OF: "SIBLING_OF",
  REPORTS_TO: "REPORTS_TO",
} as const;

export type RelationshipType = (typeof RelationshipType)[keyof typeof RelationshipType];

export const FactionType = {
  GUILD: "GUILD",
  GOVERNMENT: "GOVERNMENT",
  MILITARY: "MILITARY",
  FAMILY: "FAMILY",
} as const;

export type FactionType = (typeof FactionType)[keyof typeof FactionType];

// ─── Faction ──────────────────────────────────────────────────────────────────

export const createFactionSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  type: z.nativeEnum(FactionType),
  description: z.string().nullable().optional(),
  avatarUrl: zodFormString(z.string().url().nullable().optional()),
  imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateFactionSchema = createFactionSchema.partial().omit({ universeId: true });

export const factionQuerySchema = paginationQuerySchema.extend({
  universeId: z.string().uuid().optional(),
  type: z.nativeEnum(FactionType).optional(),
  name: z.string().optional(),
});

// ─── Character Relationships ──────────────────────────────────────────────────

export const createRelationshipSchema = z.object({
  universeId: z.string().uuid(),
  factionId: z.string().uuid().nullable().optional(),
  sourceCharacterId: z.string().uuid(),
  targetCharacterId: z.string().uuid(),
  type: z.nativeEnum(RelationshipType),
  notes: z.string().nullable().optional(),
});

export const updateRelationshipSchema = z.object({
  type: z.nativeEnum(RelationshipType).optional(),
  notes: z.string().nullable().optional(),
});

export const relationshipQuerySchema = z.object({
  universeId: z.string().uuid().optional(),
  factionId: z.string().uuid().optional(),
  sourceCharacterId: z.string().uuid().optional(),
  targetCharacterId: z.string().uuid().optional(),
  type: z.nativeEnum(RelationshipType).optional(),
});
