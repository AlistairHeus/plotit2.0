import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';
import { universes } from '@/entities/universe/universe.schema';
import { regions } from '@/entities/region/region.schema';

export const religions = pgTable(
  'religions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    universeId: uuid('universe_id')
      .references(() => universes.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    deities: text('deities').array().default([]).notNull(),
    tenets: text('tenets').array().default([]).notNull(),
    practices: text('practices').array().default([]).notNull(),
    holySites: text('holy_sites').array().default([]).notNull(),
    avatarUrl: text('avatar_url'),
    imageUrls: text('image_urls').array().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    universeIdx: index('religions_universe_idx').on(table.universeId),
    nameIdx: index('religions_name_idx').on(table.name),
  })
);

export const religionsRelations = relations(religions, ({ one, many }) => ({
  universe: one(universes, {
    fields: [religions.universeId],
    references: [universes.id],
  }),
  regions: many(regions)
}));
