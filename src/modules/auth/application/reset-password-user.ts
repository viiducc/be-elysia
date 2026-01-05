import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import type { UserRepository } from '../infrastructure/user.repository';

export class ResetPasswordUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ServerError(400, ErrorCodes.NOT_FOUND, 'User not found');
    }

    user.setPassword(password);
    await this.userRepository.update(user);
  }
}
