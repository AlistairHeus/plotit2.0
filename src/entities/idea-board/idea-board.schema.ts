import { universes } from "@/entities/universe/universe.schema";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const ideaBoards = pgTable("idea_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  elements: jsonb("elements").default([]).notNull(),
  appState: jsonb("app_state").default({}).notNull(),
  files: jsonb("files").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ideaBoardsRelations = relations(ideaBoards, ({ one }) => ({
  universe: one(universes, {
    fields: [ideaBoards.universeId],
    references: [universes.id],
  }),
}));
