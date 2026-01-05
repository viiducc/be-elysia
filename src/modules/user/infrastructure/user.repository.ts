import { SqlRepository } from '@/src/infrastructure/sql-repository';
import type { User } from '../domain/user';

export class UserRepository extends SqlRepository<User> {}
