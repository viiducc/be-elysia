import { z } from 'zod';
import type { AuthConfig } from './types';

const authConfigSchema: z.ZodType<AuthConfig> = z.object({
  serviceUrl: z.string(),
  jwtSecret: z.string(),
  jwtExpiration: z.string(),
  jwtRefreshSecret: z.string(),
  jwtRefreshExpiration: z.string(),
});

export const authConfig: AuthConfig = authConfigSchema.parse({
  serviceUrl: process.env.AUTH_SERVICE_URL ?? '',
  jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
  jwtExpiration: process.env.AUTH_JWT_EXPIRATION ?? '1h',
  jwtRefreshSecret: process.env.AUTH_JWT_REFRESH_SECRET ?? '',
  jwtRefreshExpiration: process.env.AUTH_JWT_REFRESH_EXPIRATION ?? '1d',
});
