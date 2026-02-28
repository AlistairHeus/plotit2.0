import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { universes } from "@/entities/universe/universe.schema";

export const constructCategoryEnum = pgEnum("construct_category", [
  "AFFLICTIONS",
  "MANIFESTATIONS",
  "ENTITIES",
  "VESTIGES",
]);

export const constructs = pgTable(
  "constructs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    category: constructCategoryEnum("category").notNull(),
    universeId: uuid("universe_id")
      .references(() => universes.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    properties: jsonb("properties"),
    rarity: text("rarity"),
    tags: text("tags").array().default([]).notNull(),
    avatarUrl: text("avatar_url"),
    imageUrls: text("image_urls").array().default([]).notNull(),
  },
  (table) => ({
    universeIdx: index("constructs_universe_idx").on(table.universeId),
    categoryIdx: index("constructs_category_idx").on(table.category),
    nameIdx: index("constructs_name_idx").on(table.name),
  }),
);

export const constructsRelations = relations(constructs, ({ one }) => ({
  universe: one(universes, {
    fields: [constructs.universeId],
    references: [universes.id],
  }),
}));
