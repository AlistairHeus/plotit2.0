import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { regions } from "@/entities/region/region.schema";
import { universes } from "@/entities/universe/universe.schema";

// Maps table
export const maps = pgTable("maps", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  regionId: uuid("region_id")
    .references(() => regions.id, { onDelete: "cascade" })
    .notNull(),

  // Basic Map Assets
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Map SVG Mappings Table
// Associates an SVG element (e.g. a <path id="state-12">) to a Region entity
export const mapSvgMappings = pgTable(
  "map_svg_mappings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mapId: uuid("map_id")
      .references(() => maps.id, { onDelete: "cascade" })
      .notNull(),
    svgElementId: text("svg_element_id").notNull(),
    featureType: text("feature_type").notNull(), // 'state', 'lake', 'river', 'city', etc.
    regionId: uuid("region_id")
      .references(() => regions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique("uq_map_svg_element").on(t.mapId, t.svgElementId)],
);

// Relations
export const mapsRelations = relations(maps, ({ one, many }) => ({
  universe: one(universes, {
    fields: [maps.universeId],
    references: [universes.id],
  }),
  region: one(regions, {
    fields: [maps.regionId],
    references: [regions.id],
  }),
  svgMappings: many(mapSvgMappings),
}));

export const mapSvgMappingsRelations = relations(
  mapSvgMappings,
  ({ one }) => ({
    map: one(maps, {
      fields: [mapSvgMappings.mapId],
      references: [maps.id],
    }),
    region: one(regions, {
      fields: [mapSvgMappings.regionId],
      references: [regions.id],
    }),
  }),
);
