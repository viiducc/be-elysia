export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly fullName: string | null;
  public readonly displayName: string;
  public readonly isVerified: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.fullName = user.fullName;
    this.displayName = user.displayName;
    this.isVerified = user.isVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
