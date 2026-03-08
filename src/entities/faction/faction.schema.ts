import { characters } from "@/entities/character/character.schema";
import { universes } from "@/entities/universe/universe.schema";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const factionTypeEnum = pgEnum("faction_type", [
  "GUILD",
  "GOVERNMENT",
  "MILITARY",
  "FAMILY",
]);

export const relationshipTypeEnum = pgEnum("relationship_type", [
  "SPOUSE",       // Aegon ↔ Visenya         — bidirectional marriage line
  "PARENT_OF",    // Aegon → Aenys            — directed top-to-bottom
  "SIBLING_OF",   // Rhaenys ↔ Aegon          — bidirectional sibling
  "REPORTS_TO",   // Jon Snow → Jeor Mormont  — org chart directed edge
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

/**
 * A Faction is a named group — e.g. "House Targaryen", "Night's Watch".
 * It holds metadata. The tree structure lives entirely in character_relationships.
 */
export const factions = pgTable("factions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  type: factionTypeEnum("type").notNull(),
  avatarUrl: text("avatar_url"),
  imageUrls: text("image_urls").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Every edge in a Family Tree or Org Chart is one row here.
 * factionId scopes the relationship to a specific tree (optional —
 * null means a universe-wide relationship not tied to any faction).
 *
 * Members of a faction = distinct characters appearing in its relationships.
 * No separate faction_members table needed.
 *
 * Examples:
 *   SPOUSE:    Aegon I ↔ Visenya Targaryen    (factionId = targaryen-uuid)
 *   PARENT_OF: Aegon I  → Aenys I             (factionId = targaryen-uuid)
 *   REPORTS_TO: Jon Snow → Jeor Mormont       (factionId = nights-watch-uuid)
 */
export const characterRelationships = pgTable("character_relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  factionId: uuid("faction_id")
    .references(() => factions.id, { onDelete: "cascade" }),
  sourceCharacterId: uuid("source_character_id")
    .references(() => characters.id, { onDelete: "cascade" })
    .notNull(),
  targetCharacterId: uuid("target_character_id")
    .references(() => characters.id, { onDelete: "cascade" })
    .notNull(),
  type: relationshipTypeEnum("type").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const factionsRelations = relations(factions, ({ one, many }) => ({
  universe: one(universes, {
    fields: [factions.universeId],
    references: [universes.id],
  }),
  relationships: many(characterRelationships),
}));

export const characterRelationshipsRelations = relations(
  characterRelationships,
  ({ one }) => ({
    universe: one(universes, {
      fields: [characterRelationships.universeId],
      references: [universes.id],
    }),
    faction: one(factions, {
      fields: [characterRelationships.factionId],
      references: [factions.id],
    }),
    source: one(characters, {
      fields: [characterRelationships.sourceCharacterId],
      references: [characters.id],
      relationName: "source_relationships",
    }),
    target: one(characters, {
      fields: [characterRelationships.targetCharacterId],
      references: [characters.id],
      relationName: "target_relationships",
    }),
  }),
);
