import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 22 }).primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name').notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type SelectUserTable = typeof users.$inferSelect;
export type InsertUserTable = typeof users.$inferInsert;
