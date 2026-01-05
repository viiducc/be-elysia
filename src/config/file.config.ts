import { z } from 'zod';
import type { FileConfig } from './types';

const fileConfigSchema: z.ZodType<FileConfig> = z.object({
  maxFileSize: z.number().default(1024 * 1024 * 3), // 3MB
});

export const fileConfig: FileConfig = fileConfigSchema.parse({
  maxFileSize: process.env.FILE_MAX_UPLOAD_SIZE ? parseInt(process.env.FILE_MAX_UPLOAD_SIZE) : 1024 * 1024 * 3, // 3MB
});
