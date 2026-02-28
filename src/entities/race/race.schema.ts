import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { universes } from '@/entities/universe/universe.schema';
import { characters } from '@/entities/character/character.schema';

// 1. Races
export const races = pgTable('races', {
    id: uuid('id').primaryKey().defaultRandom(),
    universeId: uuid('universe_id')
        .references(() => universes.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    lifespan: text('lifespan'),
    languages: text('languages').array(),
    origins: text('origins'),
    avatarUrl: text('avatar_url'),
    imageUrls: text('image_urls').array().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
});

// 2. Ethnic Groups
export const ethnicGroups = pgTable('ethnic_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    raceId: uuid('race_id')
        .references(() => races.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    physicalCharacteristics: text('physical_characteristics').array(),
    culturalTraits: text('cultural_traits').array(),
    regionalAdaptations: text('regional_adaptations').array(),
    climateInfluences: text('climate_influences').array(),
    languages: text('languages').array(),
    geographicOrigin: text('geographic_origin'),
    avatarUrl: text('avatar_url'),
    imageUrls: text('image_urls').array().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const racesRelations = relations(races, ({ one, many }) => ({
    universe: one(universes, {
        fields: [races.universeId],
        references: [universes.id],
    }),
    ethnicGroups: many(ethnicGroups),
    characters: many(characters),
}));

export const ethnicGroupsRelations = relations(ethnicGroups, ({ one, many }) => ({
    race: one(races, {
        fields: [ethnicGroups.raceId],
        references: [races.id],
    }),
    characters: many(characters),
}));
