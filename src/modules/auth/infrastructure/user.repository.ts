import { eq } from 'drizzle-orm';
import { user } from '@/infrastructure/sql/drizzle-migrate/schema';
import { SqlRepository } from '@/src/infrastructure/sql-repository';
import type { User } from '../domain/user';

export class UserRepository extends SqlRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return super.findOne({
      where: eq(user.email, email),
    });
  }
}
