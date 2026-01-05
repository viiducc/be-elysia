import { ResendEmailService } from '@/infrastructure/smtp/resend';
import type { IEmailService } from '@/src/infrastructure/email-service';
import type { User } from '@/src/shared/domain/user';

export class EmailService extends ResendEmailService implements IEmailService {
  send(from: string, to: string | string[], subject: string, body: string): Promise<any> {
    return this.resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: body,
    });
  }

  sendToUser(user: User, subject: string, body: string): Promise<any> {
    return this.resend.emails.send({
      from: `${this.fromName} <${this.fromEmail}>`,
      to: user.email,
      subject: subject,
      html: body,
    });
  }

  sendToUserWithTemplate(user: User, subject: string, template: any, data: any): Promise<any> {
    return this.resend.emails.send({
      from: `${this.fromName} <${this.fromEmail}>`,
      to: user.email,
      subject: subject,
      react: template(data),
    });
  }
}
