import { z } from 'zod';
import type { AppConfig } from './types';

// Validate app config
const appConfigSchema = z.object({
  port: z.number().default(3000),
  env: z.enum(['development', 'production']).default('development'),
  version: z.string(),
  publicUrl: z.url(),
});

export const appConfig: AppConfig = appConfigSchema.parse({
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  env: process.env.NODE_ENV ?? process.env.APP_ENV ?? 'development',
  version: process.env.APP_VERSION ?? '0.0.5',
  publicUrl: process.env.APP_PUBLIC_URL ?? `http://localhost:${process.env.APP_PORT ?? 3000}`,
});
