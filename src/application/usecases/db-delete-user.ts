import { DeleteUserRepository, FindUserRepository } from '@/application/interfaces';
import { UserNotFoundException } from '@/domain/errors';
import { DeleteUser } from '@/domain/usecases';

export class DbDeleteUser implements DeleteUser {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly deleteUserRepository: DeleteUserRepository,
  ) {}

  async delete(id: string): Promise<void> {
    const isUserExistent = await this.findUserRepository.find(id);
    if (!isUserExistent) {
      throw new UserNotFoundException();
    }

    await this.deleteUserRepository.delete(id);
  }
}
