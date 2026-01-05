import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';
import { User } from '../domain/user';
import type { UserRepository } from '../infrastructure/user.repository';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string, displayName?: string): Promise<User> {
    email = email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      // throw new ServerError(400, ErrorCodes.EMAIL_ALREADY_EXISTS, 'Email already exists');
      return existingUser;
    }
    // Hash password
    const passwordHash = await Bun.password.hash(password);
    // Generate UUID
    const user = new User({
      username: email,
      email,
      displayName,
      isVerified: false,
      password: passwordHash,
    });

    const error = user.validate();
    if (error) {
      throw new ServerError(400, ErrorCodes.VALIDATION_FAILED, error);
    }
    await this.userRepository.create(user);
    return user;
  }
}
