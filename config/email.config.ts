import { z } from 'zod';
import type { EmailConfig } from './types';

// Validate DB config
const emailConfigSchema = z.object({
  resendApiKey: z.string().nonempty(),
  fromEmail: z.string().nonempty(),
  fromName: z.string().nonempty(),
});

export const emailConfig: EmailConfig = emailConfigSchema.parse({
  resendApiKey: process.env.EMAIL_RESEND_API_KEY ?? '',
  fromEmail: process.env.EMAIL_SENDER_EMAIL ?? '',
  fromName: process.env.EMAIL_SENDER_NAME ?? '',
});
