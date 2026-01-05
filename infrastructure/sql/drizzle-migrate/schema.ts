/**
 * This file is the SOURCE OF TRUTH for the database schema.
 * It is used to generate the database schema and the migrations.
 * 
 * Better Auth compatible tables:
 * - user: Core user accounts
 * - session: Active user sessions
 * - identity: OAuth provider accounts (Better Auth's 'account' table)
 * - verification: Tokens for email verification and password resets
 */

import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// ============================================================================
// Better Auth Tables
// ============================================================================

/**
 * User accounts table - Better Auth compatible with extensions
 */
export const user = pgTable('user', {
  // Better Auth required fields
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').unique(),
  emailVerified: boolean('email_verified').notNull().default(false),

  // Auth extensions
  username: text('username').unique(),
  phoneNumber: text('phone_number').unique(),
  fullName: text('full_name'),

  // RBAC: 1=User, 20=Mod, 40=Admin, 80=Platform, 100=Super
  roleLevel: integer('role_level').notNull().default(1),

  // Security
  isSuspended: boolean('is_suspended').notNull().default(false),
  suspensionReason: text('suspension_reason'),
  suspendedAt: timestamp('suspended_at', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

/**
 * Session table - Better Auth required
 */
export const session = pgTable('session', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdate(() => new Date()),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

/**
 * Identity table - OAuth provider accounts (Better Auth's 'account' table)
 */
export const identity = pgTable('identity', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdate(() => new Date()),
});

/**
 * Verification table - Better Auth required for email verification and password resets
 */
export const verification = pgTable('verification', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdate(() => new Date()),
});

// ============================================================================
// Relations
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  identities: many(identity),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const identityRelations = relations(identity, ({ one }) => ({
  user: one(user, {
    fields: [identity.userId],
    references: [user.id],
  }),
}));

// ============================================================================
// Types
// ============================================================================

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Identity = typeof identity.$inferSelect;
export type Verification = typeof verification.$inferSelect;
