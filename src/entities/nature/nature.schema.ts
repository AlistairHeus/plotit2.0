import { universes } from "@/entities/universe/universe.schema";
import { relations } from "drizzle-orm";
import {
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";

export const natureTypeEnum = pgEnum("nature_type", [
    "PLANT",
    "ANIMAL",
    "MINERAL",
]);

export const occuranceEnum = pgEnum("occurance", [
    "EXTANT",
    "EXTINCT",
    "MYTHICAL",
]);

export const nature = pgTable(
    "nature",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        universeId: uuid("universe_id")
            .references(() => universes.id, { onDelete: "cascade" })
            .notNull(),
        name: text("name").notNull(),
        type: natureTypeEnum("type").notNull(),
        description: text("description"),
        occurance: occuranceEnum("occurance").default("EXTANT"),
        avatarUrl: text("avatar_url"),
        imageUrls: text("image_urls").array().default([]).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        index("nature_universe_idx").on(table.universeId),
        index("nature_type_idx").on(table.type),
        index("nature_name_idx").on(table.name),
    ]
);

export const natureRelations = relations(nature, ({ one }) => ({
    universe: one(universes, {
        fields: [nature.universeId],
        references: [universes.id],
    }),
}));
