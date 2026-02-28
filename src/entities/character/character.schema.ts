import { relations } from 'drizzle-orm';
import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { universes } from '@/entities/universe/universe.schema';
import { races, ethnicGroups } from '@/entities/race/race.schema';
import { characterPowerAccess } from '@/entities/power-system/power-system.schema';

export const characters = pgTable('characters', {
    id: uuid('id').primaryKey().defaultRandom(),
    universeId: uuid('universe_id')
        .references(() => universes.id, { onDelete: 'cascade' })
        .notNull(),
    raceId: uuid('race_id').references(() => races.id, { onDelete: 'set null' }),
    ethnicGroupId: uuid('ethnic_group_id').references(() => ethnicGroups.id, {
        onDelete: 'set null',
    }),
    name: text('name').notNull(),
    background: text('background'),
    type: text('type'), // e.g., 'protagonist', 'antagonist', 'npc'
    gender: text('gender').default('unspecified'),
    age: integer('age'),
    colorCode: text('color_code'),
    avatarUrl: text('avatar_url'),
    imageUrls: text('image_urls').array().default([]).notNull(),
    benched: boolean('benched').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
});

export const charactersRelations = relations(characters, ({ one, many }) => ({
    universe: one(universes, {
        fields: [characters.universeId],
        references: [universes.id],
    }),
    race: one(races, {
        fields: [characters.raceId],
        references: [races.id],
    }),
    ethnicGroup: one(ethnicGroups, {
        fields: [characters.ethnicGroupId],
        references: [ethnicGroups.id],
    }),
    powerAccess: many(characterPowerAccess),
}));
