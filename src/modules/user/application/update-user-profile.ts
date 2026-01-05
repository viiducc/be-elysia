import type { UserRepository } from '@modules/user/infrastructure/user.repository';
import type { User } from '../domain/user';

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Update user profile in DB
    throw new Error('Not implemented');
  }
}
