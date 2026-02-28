import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type {
  GridCellData,
  GridSettings,
  MapOverlay,
} from "./map.types";
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
  viewBox: text("view_box"),

  // Grid Sizing Definitions
  gridSettings: jsonb("grid_settings")
    .$type<GridSettings>()
    .default({
      enabled: true,
      size: 20,
      scale: 1.0,
      width: null,
      height: null,
      hexWidth: null,
      hexHeight: null,
      horizontalSpacing: null,
      verticalSpacing: null,
    })
    .notNull(),

  // Map Regions / Bounds / Overlays
  // Example: [{ "regionId": "...", "zIndex": 0, "opacity": 1.0, "visible": true, "bounds": {...} }]
  mapOverlays: jsonb("map_overlays")
    .$type<MapOverlay[]>()
    .default([])
    .notNull(),

  // Grid Data (the thousands of hexes)
  // Stored as a dictionary mapping "row,col" to cell data
  // Example: {"5,10": { "terrainType": "grass", "features": [{ "type": "TOWN", "intensity": 1.0 }], "elevation": 100, "regionId": "some-uuid" }}
  cellData: jsonb("cell_data")
    .$type<Record<string, GridCellData>>()
    .default({})
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Map SVG Mappings Table
export const mapSvgMappings = pgTable("map_svg_mappings", {
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
});

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
