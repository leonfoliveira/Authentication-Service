import { DeleteUserRepository, FindUserRepository } from '@/application/interfaces';
import { DeleteUser } from '@/domain/usecases';

export class DbDeleteUser implements DeleteUser {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly deleteUserRepository: DeleteUserRepository,
  ) {}

  async delete(id: string): Promise<void> {
    const isUserExistent = await this.findUserRepository.find(id);
    if (!isUserExistent) {
      throw new Error('USER_NOT_FOUND');
    }

    await this.deleteUserRepository.delete(id);
  }
}
