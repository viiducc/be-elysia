import type { GetUserProfileUseCase } from '../../application/get-user-profile';
import type { UpdateUserProfileUseCase } from '../../application/update-user-profile';
import type { User } from '../../domain/user';

export class UserController {
  constructor(
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    return this.updateUserProfileUseCase.execute(userId, data);
  }

  async getUserProfile(userId: string): Promise<User> {
    return this.getUserProfileUseCase.execute(userId);
  }
}
