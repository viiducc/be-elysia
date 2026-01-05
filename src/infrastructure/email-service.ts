import type { User } from '@@/shared/domain/user';

export interface IEmailService {
  send(from: string, to: string | string[], subject: string, body: string): Promise<any>;
  sendToUser(user: User, subject: string, body: string): Promise<any>;
  sendToUserWithTemplate(user: User, subject: string, template: any, data: any): Promise<any>;
}
