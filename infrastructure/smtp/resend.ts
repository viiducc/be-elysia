import { Resend } from 'resend';
import { emailConfig } from '@/config/email.config';

const resend = new Resend(emailConfig.resendApiKey);

export class ResendEmailService {
  protected readonly resend: Resend;
  protected readonly fromEmail: string;
  protected readonly fromName: string;

  constructor() {
    this.resend = resend;
    this.fromEmail = emailConfig.fromEmail;
    this.fromName = emailConfig.fromName;
  }
}
