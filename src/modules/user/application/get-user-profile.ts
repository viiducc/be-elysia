import type { UserRepository } from '@modules/user/infrastructure/user.repository';
import type { User } from '../domain/user';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    // TODO: Get user profile from DB
    throw new Error('Not implemented');
  }
}
