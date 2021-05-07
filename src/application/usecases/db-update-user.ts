import { FindUserRepository, UpdateUserRepository } from '@/application/interfaces';
import { User } from '@/domain/models';
import { UpdateUser, UpdateUserDTO } from '@/domain/usecases';

export class DbUpdateUser implements UpdateUser {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly updateUserRepository: UpdateUserRepository,
  ) {}

  async update(id: string, params: UpdateUserDTO): Promise<User> {
    const isUserExistent = await this.findUserRepository.find(id);
    if (!isUserExistent) {
      throw new Error('USER_NOT_FOUND');
    }

    const user = await this.updateUserRepository.update(id, params);

    return user;
  }
}
