import { relations } from 'drizzle-orm';
import {
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { universes } from '@/entities/universe/universe.schema';

// Enums
export const galaxyTypeEnum = pgEnum('galaxy_type', [
    'SPIRAL',
    'BARRED_SPIRAL',
    'ELLIPTICAL',
    'IRREGULAR',
    'LENTICULAR',
    'RING',
    'DWARF',
    'QUASAR',
]);

export const spectralTypeEnum = pgEnum('spectral_type', [
    'HOT_BLUE_STAR',
    'BLUE_WHITE_STAR',
    'WHITE_STAR',
    'YELLOW_WHITE_STAR',
    'YELLOW_STAR',
    'ORANGE_STAR',
    'RED_STAR',
    'LUMINOUS_RED_GIANT',
    'SUPER_GIANT',
    'WHITE_DWARF',
    'NEUTRON_STAR',
    'BLACK_HOLE',
    'UNKNOWN',
]);

// Galaxies
export const galaxies = pgTable('galaxies', {
    id: uuid('id').primaryKey().defaultRandom(),
    universeId: uuid('universe_id')
        .references(() => universes.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    type: galaxyTypeEnum('type').default('SPIRAL').notNull(),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Solar Systems
export const solarSystems = pgTable('solar_systems', {
    id: uuid('id').primaryKey().defaultRandom(),
    galaxyId: uuid('galaxy_id')
        .references(() => galaxies.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stars
export const stars = pgTable('stars', {
    id: uuid('id').primaryKey().defaultRandom(),
    systemId: uuid('solar_system_id')
        .references(() => solarSystems.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    type: spectralTypeEnum('type').default('YELLOW_STAR').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Planets (Includes Moons via parentId)
export const planets = pgTable('planets', {
    id: uuid('id').primaryKey().defaultRandom(),
    systemId: uuid('solar_system_id')
        .references(() => solarSystems.id, { onDelete: 'cascade' })
        .notNull(),
    parentId: uuid('parent_planet_id'), // Self-reference for moons
    name: text('name').notNull(),
    description: text('description'),
    color: text('color'),
    isHabitable: boolean('is_habitable').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const galaxiesRelations = relations(galaxies, ({ one, many }) => ({
    universe: one(universes, {
        fields: [galaxies.universeId],
        references: [universes.id],
    }),
    solarSystems: many(solarSystems),
}));

export const solarSystemsRelations = relations(solarSystems, ({ one, many }) => ({
    galaxy: one(galaxies, {
        fields: [solarSystems.galaxyId],
        references: [galaxies.id],
    }),
    stars: many(stars),
    planets: many(planets),
}));

export const starsRelations = relations(stars, ({ one }) => ({
    solarSystem: one(solarSystems, {
        fields: [stars.systemId],
        references: [solarSystems.id],
    }),
}));

import { regions } from '@/entities/region/region.schema';

export const planetsRelations = relations(planets, ({ one, many }) => ({
    solarSystem: one(solarSystems, {
        fields: [planets.systemId],
        references: [solarSystems.id],
    }),
    parentPlanet: one(planets, {
        fields: [planets.parentId],
        references: [planets.id],
        relationName: 'moon_of',
    }),
    moons: many(planets, {
        relationName: 'moon_of',
    }),
    regions: many(regions),
}));
