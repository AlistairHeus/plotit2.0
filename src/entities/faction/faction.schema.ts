import { characters } from "@/entities/character/character.schema";
import { regions } from "@/entities/region/region.schema";
import { universes } from "@/entities/universe/universe.schema";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const factionTypeEnum = pgEnum("faction_type", [
  "GUILD",
  "GOVERNMENT",
  "MILITARY",
  "FAMILY",
]);

export const factions = pgTable("factions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  parentId: uuid("parent_id"), // Recursive relationship for hierarchy
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  type: factionTypeEnum("type").notNull(),
  headquartersId: uuid("headquarters_id").references(() => regions.id, {
    onDelete: "set null",
  }),

  avatarUrl: text("avatar_url"),
  imageUrls: text("image_urls").array().default([]).notNull(),
});

export const factionMembers = pgTable("faction_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  factionId: uuid("faction_id")
    .references(() => factions.id, { onDelete: "cascade" })
    .notNull(),
  characterId: uuid("character_id")
    .references(() => characters.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title"), // e.g. "Grand Master", "Admiral"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const factionsRelations = relations(factions, ({ one, many }) => ({
  universe: one(universes, {
    fields: [factions.universeId],
    references: [universes.id],
  }),
  parent: one(factions, {
    fields: [factions.parentId],
    references: [factions.id],
    relationName: "faction_hierarchy",
  }),
  subFactions: many(factions, {
    relationName: "faction_hierarchy",
  }),
  headquarters: one(regions, {
    fields: [factions.headquartersId],
    references: [regions.id],
  }),
  members: many(factionMembers),
}));

export const factionMembersRelations = relations(factionMembers, ({ one }) => ({
  faction: one(factions, {
    fields: [factionMembers.factionId],
    references: [factions.id],
  }),
  character: one(characters, {
    fields: [factionMembers.characterId],
    references: [characters.id],
  }),
}));
