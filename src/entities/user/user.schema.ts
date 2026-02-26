import { relations } from 'drizzle-orm';
import {
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { userRoleEnum } from '@/entities/user/user.constants';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
  phoneNumber: text('phone_number'),
  profilePicture: text('profile_picture'),
  primaryLanguage: text('primary_language'),
  gender: text('gender'),
  metadata: jsonb('metadata'),
});

// Relations
export const usersRelations = relations(users, () => ({
  // Simplified - no domain profile relations
}));
