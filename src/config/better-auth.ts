/**
 * Better Auth configuration - Optimized for performance
 * 
 * Uses SHA256 for password hashing (much faster than bcrypt)
 * Reference: funu-backend implementation
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from '@/infrastructure/sql/db';
import * as schema from '@/infrastructure/sql/drizzle-migrate/schema';

// Create Drizzle instance for Better Auth (singleton)
const db = drizzle(sql, { schema });

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Fast SHA256 password hashing (from funu-backend)
 * Much faster than bcrypt (~0.1ms vs ~100ms)
 */
async function sha256Hex(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    secret: process.env.BETTER_AUTH_SECRET || '',
    trustedOrigins: ['*'], // Allow all origins for development

    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),

    // Use 'identity' table instead of default 'account'
    account: {
        modelName: 'identity',
    },

    // Email and password authentication with fast SHA256 hashing
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        password: {
            hash: async (password) =>
                sha256Hex(`${process.env.BETTER_AUTH_SECRET || ''}:${password}`),
            verify: async ({ hash, password }) =>
                hash === (await sha256Hex(`${process.env.BETTER_AUTH_SECRET || ''}:${password}`)),
        },
    },

    // Session configuration - optimized
    session: {
        expiresIn: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60,      // Update every 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 10 * 60,            // 10 min cache
        },
    },

    // Advanced settings
    advanced: {
        useSecureCookies: isProduction,
        cookiePrefix: 'agripos',
        database: {
            generateId: false, // Use Postgres gen_random_uuid()
        },
    },

    // Rate limiting - disabled in dev for faster testing
    rateLimit: {
        enabled: isProduction,
        window: 60,
        max: 100,
    },
});

export type Auth = typeof auth;
