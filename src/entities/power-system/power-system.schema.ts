import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { characters } from "@/entities/character/character.schema";
import { universes } from "@/entities/universe/universe.schema";

// 1. Root of Power
export const rootsOfPower = pgTable("roots_of_power", {
  id: uuid("id").primaryKey().defaultRandom(),
  universeId: uuid("universe_id")
    .references(() => universes.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Power Systems
export const powerSystems = pgTable("power_systems", {
  id: uuid("id").primaryKey().defaultRandom(),
  rootOfPowerId: uuid("root_of_power_id")
    .references(() => rootsOfPower.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  rank: integer("rank").default(1).notNull(),
  rules: text("rules"),
  isActive: boolean("is_active").default(true).notNull(),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Power SubSystems
export const powerSubSystems = pgTable("power_subsystems", {
  id: uuid("id").primaryKey().defaultRandom(),
  powerSystemId: uuid("power_system_id")
    .references(() => powerSystems.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  rank: integer("rank").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  requirements: jsonb("requirements"),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Power Categories
export const powerCategories = pgTable("power_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  subSystemId: uuid("subsystem_id")
    .references(() => powerSubSystems.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  rank: integer("rank").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  requirements: jsonb("requirements"),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Power Abilities
export const powerAbilities = pgTable("power_abilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => powerCategories.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  rank: integer("rank").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  requirements: jsonb("requirements"),
  icon: text("icon"),
  color: text("color"),
  cooldown: integer("cooldown"),
  manaCost: integer("mana_cost"),
  damage: jsonb("damage"),
  effects: jsonb("effects"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Character Power Access
export const characterPowerAccess = pgTable(
  "character_power_access",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    characterId: uuid("character_id")
      .references(() => characters.id, { onDelete: "cascade" })
      .notNull(),
    powerSystemId: uuid("power_system_id").references(() => powerSystems.id, {
      onDelete: "cascade",
    }),
    subSystemId: uuid("subsystem_id").references(() => powerSubSystems.id, {
      onDelete: "cascade",
    }),
    categoryId: uuid("category_id").references(() => powerCategories.id, {
      onDelete: "cascade",
    }),
    abilityId: uuid("ability_id").references(() => powerAbilities.id, {
      onDelete: "cascade",
    }),
    accessLevel: integer("access_level").default(1).notNull(),
    masteryPoints: integer("mastery_points").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at"),
    usageCount: integer("usage_count").default(0).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(
      t.characterId,
      t.powerSystemId,
      t.subSystemId,
      t.categoryId,
      t.abilityId,
    ),
  ],
);

// Relations
export const rootsOfPowerRelations = relations(
  rootsOfPower,
  ({ one, many }) => ({
    universe: one(universes, {
      fields: [rootsOfPower.universeId],
      references: [universes.id],
    }),
    powerSystems: many(powerSystems),
  }),
);

export const powerSystemsRelations = relations(
  powerSystems,
  ({ one, many }) => ({
    rootOfPower: one(rootsOfPower, {
      fields: [powerSystems.rootOfPowerId],
      references: [rootsOfPower.id],
    }),
    subSystems: many(powerSubSystems),
    characterAccess: many(characterPowerAccess),
  }),
);

export const powerSubSystemsRelations = relations(
  powerSubSystems,
  ({ one, many }) => ({
    powerSystem: one(powerSystems, {
      fields: [powerSubSystems.powerSystemId],
      references: [powerSystems.id],
    }),
    categories: many(powerCategories),
    characterAccess: many(characterPowerAccess),
  }),
);

export const powerCategoriesRelations = relations(
  powerCategories,
  ({ one, many }) => ({
    subSystem: one(powerSubSystems, {
      fields: [powerCategories.subSystemId],
      references: [powerSubSystems.id],
    }),
    abilities: many(powerAbilities),
    characterAccess: many(characterPowerAccess),
  }),
);

export const powerAbilitiesRelations = relations(
  powerAbilities,
  ({ one, many }) => ({
    category: one(powerCategories, {
      fields: [powerAbilities.categoryId],
      references: [powerCategories.id],
    }),
    characterAccess: many(characterPowerAccess),
  }),
);

export const characterPowerAccessRelations = relations(
  characterPowerAccess,
  ({ one }) => ({
    powerSystem: one(powerSystems, {
      fields: [characterPowerAccess.powerSystemId],
      references: [powerSystems.id],
    }),
    subSystem: one(powerSubSystems, {
      fields: [characterPowerAccess.subSystemId],
      references: [powerSubSystems.id],
    }),
    category: one(powerCategories, {
      fields: [characterPowerAccess.categoryId],
      references: [powerCategories.id],
    }),
    ability: one(powerAbilities, {
      fields: [characterPowerAccess.abilityId],
      references: [powerAbilities.id],
    }),
    character: one(characters, {
      fields: [characterPowerAccess.characterId],
      references: [characters.id],
    }),
  }),
);
