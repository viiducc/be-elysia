import { User as SharedUser } from '@@/shared/domain/user';

export class User extends SharedUser {
  public readonly deletedAt: Date | null;

  constructor(user: User) {
    super(user);
    this.deletedAt = user.deletedAt;
  }
}
