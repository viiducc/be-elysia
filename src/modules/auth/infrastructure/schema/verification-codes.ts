import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const verificationCodes = pgTable('verification_codes', {
  id: varchar('id', { length: 22 }).primaryKey(),
  userId: text('user_id').notNull(),
  verificationType: text('verification_type').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
});

export type SelectVerificationCodeTable = typeof verificationCodes.$inferSelect;
export type InsertVerificationCodeTable = typeof verificationCodes.$inferInsert;
