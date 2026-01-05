import type { InsertUserTable, SelectUserTable } from '@modules/auth/infrastructure/schema/users';
import type { IMapper } from '@/src/infrastructure/sql-repository';
import type { User } from '../domain/user';

export class UserMapper implements IMapper<User> {
  toPersistence(domain: User): InsertUserTable {
    return {
      id: domain.id,
      username: domain.username,
      email: domain.email,
      displayName: domain.displayName,
      isVerified: domain.isVerified,
      createdAt: domain.createdAt,
      password: domain.password,
    };
  }
  toDomain(dbResult: SelectUserTable): User {
    return {
      id: dbResult.id,
      username: dbResult.username,
      email: dbResult.email,
      displayName: dbResult.displayName,
      isVerified: dbResult.isVerified,
      createdAt: dbResult.createdAt,
    } as User;
  }
  toDomainList(dbResults: SelectUserTable[]): User[] {
    return dbResults.map((dbResult) => this.toDomain(dbResult));
  }
  toUpdatePersistence(domain: User): Partial<InsertUserTable> {
    return {
      email: domain.email,
      displayName: domain.displayName,
      isVerified: domain.isVerified,
    };
  }
}
