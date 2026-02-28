import { relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { planets } from "@/entities/celestial/celestial.schema";
import { religions } from "@/entities/religion/religion.schema";
import { universes } from "@/entities/universe/universe.schema";

export const regionTypeEnum = pgEnum("region_type", [
  "CONTINENT",
  "OCEAN",
  "SEA",
  "LAKE",
  "STATE",
  "CITY",
  "MOUNTAIN_RANGE",
  "FOREST",
  "DESERT",
  "ISLAND",
  "VALLEY",
  "RIVER",
]);

export const regionClimateEnum = pgEnum("region_climate", [
  "TROPICAL",
  "SUBTROPICAL",
  "TEMPERATE",
  "SUBARCTIC",
  "ARCTIC",
  "DESERT",
  "MEDITERRANEAN",
  "OCEANIC",
  "CONTINENTAL",
  "ALPINE",
  "CUSTOM",
]);

export const regionFeatureTypeEnum = pgEnum("region_feature_type", [
  "MOUNTAIN",
  "HILL",
  "FOREST",
  "DESERT",
  "WATER",
  "GRASSLAND",
  "SETTLEMENT",
  "LANDMARK",
  "CUSTOM",
]);

export const regions = pgTable("regions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  type: regionTypeEnum("type").notNull(),
  features: regionFeatureTypeEnum("features").array().default([]).notNull(), // Array of RegionFeatureType
  planetId: uuid("planet_id").references(() => planets.id, {
    onDelete: "set null",
  }),
  area: doublePrecision("area"),
  boundaries: jsonb("boundaries"),
  capital: text("capital"),
  coastlineLength: doublePrecision("coastline_length"),
  coordinates: jsonb("coordinates"),
  culture: text("culture"),
  elevation: doublePrecision("elevation"),
  government: text("government"),
  language: text("language").array().default([]).notNull(),
  population: integer("population"),
  religionId: uuid("religion_id").references(() => religions.id, {
    onDelete: "set null",
  }),
  rainfall: doublePrecision("rainfall"),
  temperature: doublePrecision("temperature"),
  waterBodies: integer("water_bodies"),
  climate: regionClimateEnum("climate"),
  resources: text("resources").array().default([]).notNull(),
  avatarUrl: text("avatar_url"),
  imageUrls: text("image_urls").array().default([]).notNull(),
});

export const regionsRelations = relations(regions, ({ one, many }) => ({
  universe: one(universes, {
    fields: [regions.universeId],
    references: [universes.id],
  }),
  parent: one(regions, {
    fields: [regions.parentId],
    references: [regions.id],
    relationName: "region_hierarchy",
  }),
  subRegions: many(regions, {
    relationName: "region_hierarchy",
  }),
  planet: one(planets, {
    fields: [regions.planetId],
    references: [planets.id],
  }),
  religion: one(religions, {
    fields: [regions.religionId],
    references: [religions.id],
  }),
}));
