import { User as SharedUser } from '@@/shared/domain/user';
import { z } from 'zod';
import { newShortId } from '@/src/shared/utils/string';

const userSchema = z.object({
  id: z.string().length(22),
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(1),
  displayName: z.string().min(1),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class User extends SharedUser implements z.infer<typeof userSchema> {
  public password: string;
  public override isVerified: boolean;
  public override displayName: string;

  constructor(user: Partial<User>) {
    const now = new Date();
    super({
      id: user.id || newShortId(),
      username: user.username || '',
      email: user.email || '',
      displayName: user.displayName || '',
      isVerified: user.isVerified || false,
      createdAt: user.createdAt || now,
      updatedAt: user.updatedAt || now,
    });
    this.password = user.password || '';
    this.isVerified = user.isVerified || false;
    this.displayName = user.displayName || user.username?.split('@')[0] || '';
  }

  validate(): string | null {
    const result = userSchema.safeParse(this);
    if (!result.success) {
      return result.error?.issues[0]?.message || 'Invalid user';
    }
    return null;
  }

  setVerified(isVerified: boolean): void {
    this.isVerified = isVerified;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }
}
