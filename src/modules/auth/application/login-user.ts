import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import type { User } from '../domain/user';
import type { UserRepository } from '../infrastructure/user.repository';

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ServerError(400, ErrorCodes.NOT_FOUND, 'Invalid username or password');
    }

    const isMatch = await Bun.password.verify(password, user.password);
    if (!isMatch) {
      throw new ServerError(400, ErrorCodes.UNAUTHORIZED, 'Invalid username or password');
    }

    return user;
  }
}
