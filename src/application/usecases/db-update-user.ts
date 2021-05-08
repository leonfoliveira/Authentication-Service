import {
  FindUserByEmailRepository,
  FindUserRepository,
  UpdateUserRepository,
} from '@/application/interfaces';
import { EmailInUseException, UserNotFoundException } from '@/domain/errors';
import { User } from '@/domain/models';
import { UpdateUser, UpdateUserDTO } from '@/domain/usecases';

export class DbUpdateUser implements UpdateUser {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly updateUserRepository: UpdateUserRepository,
  ) {}

  async update(id: string, params: UpdateUserDTO): Promise<User> {
    const existentUser = await this.findUserRepository.find(id);
    if (!existentUser) {
      throw new UserNotFoundException();
    }

    if (params.email && params.email !== existentUser.email) {
      const isEmailInUse = await this.findUserByEmailRepository.findByEmail(params.email);
      if (isEmailInUse) {
        throw new EmailInUseException();
      }
    }

    const user = await this.updateUserRepository.update(id, params);

    return user;
  }
}
