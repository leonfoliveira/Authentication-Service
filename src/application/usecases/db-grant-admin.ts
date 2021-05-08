import { FindUserRepository, UserGrantAdminRepository } from '@/application/interfaces';
import { UserNotFoundException } from '@/domain/errors';
import { GrantAdmin } from '@/domain/usecases';

export class DbGrantAdmin implements GrantAdmin {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly userGrantAdminRepository: UserGrantAdminRepository,
  ) {}

  async grant(id: string): Promise<void> {
    const isUserExistent = await this.findUserRepository.find(id);
    if (!isUserExistent) {
      throw new UserNotFoundException();
    }

    await this.userGrantAdminRepository.grant(id);
  }
}
