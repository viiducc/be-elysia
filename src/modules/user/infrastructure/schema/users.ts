import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  displayName: text('display_name').notNull().default(sql`email`),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export type SelectUserTable = typeof users.$inferSelect;
export type InsertUserTable = typeof users.$inferInsert;
