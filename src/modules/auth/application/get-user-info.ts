import type { User } from '../domain/user';
import type { UserRepository } from '../infrastructure/user.repository';

export class GetUserInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
