import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import type { UserRepository } from '../infrastructure/user.repository';

export class VerifyUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ServerError(ErrorCodes.NOT_FOUND, 'User not found');
    }

    if (user.isVerified) {
      return;
    }

    user.isVerified = true;
    await this.userRepository.update(user);
  }
}
