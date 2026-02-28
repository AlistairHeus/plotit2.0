import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  regionFeatureTypeEnum,
  regions,
} from '@/entities/region/region.schema';
import { universes } from '@/entities/universe/universe.schema';

// Maps table
export const maps = pgTable('maps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  universeId: uuid('universe_id')
    .references(() => universes.id, { onDelete: 'cascade' })
    .notNull(),
  regionId: uuid('region_id')
    .references(() => regions.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: text('image_url').notNull(),
  gridEnabled: boolean('grid_enabled').default(true).notNull(),
  gridSize: integer('grid_size').default(20).notNull(),
  gridScale: doublePrecision('grid_scale').default(1.0).notNull(),
  svgContent: text('svg_content'),
  viewBox: text('view_box'),
  gridHeight: integer('grid_height'),
  gridHexHeight: doublePrecision('grid_hex_height'),
  gridHexWidth: doublePrecision('grid_hex_width'),
  gridHorizontalSpacing: doublePrecision('grid_horizontal_spacing'),
  gridVerticalSpacing: doublePrecision('grid_vertical_spacing'),
  gridWidth: integer('grid_width'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Grid cells table
export const gridCells = pgTable(
  'grid_cells',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mapId: uuid('map_id')
      .references(() => maps.id, { onDelete: 'cascade' })
      .notNull(),
    row: integer('row').notNull(),
    col: integer('col').notNull(),
    regionId: uuid('region_id').references(() => regions.id),
    terrainType: text('terrain_type'),
    featureType: regionFeatureTypeEnum('feature_type'),
    elevation: doublePrecision('elevation'),
    pathData: text('path_data'),
  },
  (table) => ({
    unq: unique().on(table.mapId, table.row, table.col),
  })
);

// Map regions table (Many-to-Many join table)
export const mapRegions = pgTable(
  'map_regions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mapId: uuid('map_id')
      .references(() => maps.id, { onDelete: 'cascade' })
      .notNull(),
    regionId: uuid('region_id')
      .references(() => regions.id, { onDelete: 'cascade' })
      .notNull(),
    zIndex: integer('z_index').default(0).notNull(),
    opacity: doublePrecision('opacity').default(1.0).notNull(),
    visible: boolean('visible').default(true).notNull(),
    boundsTop: doublePrecision('bounds_top'),
    boundsLeft: doublePrecision('bounds_left'),
    boundsRight: doublePrecision('bounds_right'),
    boundsBottom: doublePrecision('bounds_bottom'),
  },
  (table) => ({
    unq: unique().on(table.mapId, table.regionId),
  })
);

// Grid cell features table
export const gridCellFeatures = pgTable('grid_cell_features', {
  id: uuid('id').primaryKey().defaultRandom(),
  gridCellId: uuid('grid_cell_id')
    .references(() => gridCells.id, { onDelete: 'cascade' })
    .notNull(),
  featureType: regionFeatureTypeEnum('feature_type').notNull(),
  intensity: doublePrecision('intensity').default(1.0).notNull(),
});

// Region SVG mappings table
export const regionSvgMappings = pgTable(
  'region_svg_mappings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mapId: uuid('map_id')
      .references(() => maps.id, { onDelete: 'cascade' })
      .notNull(),
    regionId: uuid('region_id')
      .references(() => regions.id, { onDelete: 'cascade' })
      .notNull(),
    svgStateId: text('svg_state_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    unq: unique().on(table.mapId, table.svgStateId),
  })
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
  gridCells: many(gridCells),
  mapRegions: many(mapRegions),
  svgMappings: many(regionSvgMappings),
}));

export const gridCellsRelations = relations(gridCells, ({ one, many }) => ({
  map: one(maps, {
    fields: [gridCells.mapId],
    references: [maps.id],
  }),
  region: one(regions, {
    fields: [gridCells.regionId],
    references: [regions.id],
  }),
  features: many(gridCellFeatures),
}));

export const mapRegionsRelations = relations(mapRegions, ({ one }) => ({
  map: one(maps, {
    fields: [mapRegions.mapId],
    references: [maps.id],
  }),
  region: one(regions, {
    fields: [mapRegions.regionId],
    references: [regions.id],
  }),
}));

export const gridCellFeaturesRelations = relations(
  gridCellFeatures,
  ({ one }) => ({
    gridCell: one(gridCells, {
      fields: [gridCellFeatures.gridCellId],
      references: [gridCells.id],
    }),
  })
);

export const regionSvgMappingsRelations = relations(
  regionSvgMappings,
  ({ one }) => ({
    map: one(maps, {
      fields: [regionSvgMappings.mapId],
      references: [maps.id],
    }),
    region: one(regions, {
      fields: [regionSvgMappings.regionId],
      references: [regions.id],
    }),
  })
);
