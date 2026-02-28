import { galaxies } from '@/entities/celestial/celestial.schema';
import { characters } from '@/entities/character/character.schema';
import { rootsOfPower } from '@/entities/power-system/power-system.schema';
import { races } from '@/entities/race/race.schema';
import { religions } from '@/entities/religion/religion.schema';
import { users } from '@/entities/user/user.schema';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { constructs } from '@/entities/construct/construct.schema';
import { maps } from '@/entities/map/map.schema';
import { regions } from '@/entities/region/region.schema';


export const universes = pgTable('universes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const universesRelations = relations(universes, ({ one, many }) => ({
  user: one(users, {
    fields: [universes.userId],
    references: [users.id],
  }),
  galaxies: many(galaxies),
  rootOfPower: many(rootsOfPower),
  characters: many(characters),
  races: many(races),
  religions: many(religions),
  regions: many(regions),
  constructs: many(constructs),
  maps: many(maps),
}));
