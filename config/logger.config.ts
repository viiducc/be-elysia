import { z } from 'zod';
import type { LoggerConfig } from './types';

const loggerConfigSchema = z.object({
  level: z.string(),
});

export const loggerConfig: LoggerConfig = loggerConfigSchema.parse({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
});
