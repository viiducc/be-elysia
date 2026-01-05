import { z } from 'zod';
import type { DbConfig } from './types';

// Validate DB config
const dbConfigSchema = z.object({
  host: z.string(),
  port: z.number().default(5432),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  ssl: z
    .boolean()
    .or(z.enum(['require', 'allow', 'prefer', 'verify-full']))
    .default(false),
  driver: z.string().default('postgres'),
  migrationsSchema: z.string().default('migrate'),
});

export const dbConfig: DbConfig = dbConfigSchema.parse({
  host: process.env.DB_HOST ?? '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  name: process.env.DB_NAME ?? '',
  username: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  ssl: process.env.DB_SSL ? process.env.DB_SSL === 'true' : process.env.DB_SSL,
  driver: process.env.DB_DRIVER ?? 'postgres',
  migrationsSchema: process.env.DB_MIGRATIONS_SCHEMA ?? 'migrate',
});
