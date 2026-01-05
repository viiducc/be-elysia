import type { IMapper } from '@/src/infrastructure/sql-repository';
import type { User } from '../domain/user';
import type { InsertUserTable, SelectUserTable } from './schema/users';

export class UserMapper implements IMapper<User> {
  toPersistence(domain: User): InsertUserTable {
    return {
      id: domain.id,
      username: domain.username,
      email: domain.email,
      displayName: domain.displayName,
      isVerified: domain.isVerified,
      createdAt: domain.createdAt,
    };
  }
  toDomain(dbResult: SelectUserTable): User {
    return {
      id: dbResult.id,
      username: dbResult.username,
      displayName: dbResult.displayName,
      isVerified: dbResult.isVerified,
      createdAt: dbResult.createdAt,
      updatedAt: dbResult.updatedAt,
      deletedAt: dbResult.deletedAt,
    } as User;
  }
  toDomainList(dbResults: SelectUserTable[]): User[] {
    return dbResults.map((dbResult) => this.toDomain(dbResult));
  }
  toUpdatePersistence(domain: User): Partial<InsertUserTable> {
    return {
      username: domain.username,
      displayName: domain.displayName,
      isVerified: domain.isVerified,
    };
  }
}
