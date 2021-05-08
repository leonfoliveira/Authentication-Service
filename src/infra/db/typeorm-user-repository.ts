import {
  CreateUserRepository,
  CreateUserRepositoryDTO,
  CreateUserRepositoryResult,
  DeleteUserRepository,
  FindUserByEmailConfirmTokenRepository,
  FindUserByEmailConfirmTokenRepositoryResult,
  FindUserByEmailRepository,
  FindUserByEmailRepositoryResult,
} from '@/application/interfaces';
import { UserEntity } from '@/infra/entities';

export class TypeormUserRepository
  implements
    CreateUserRepository,
    DeleteUserRepository,
    FindUserByEmailConfirmTokenRepository,
    FindUserByEmailRepository {
  async create(params: CreateUserRepositoryDTO): Promise<CreateUserRepositoryResult> {
    const user = new UserEntity();
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.password = params.password;
    user.emailConfirmToken = params.emailConfirmToken;
    return this.adapt(await user.save());
  }

  async delete(id: string): Promise<void> {
    const user = await UserEntity.findOne(id);
    await user.softRemove();
  }

  async findByEmailConfirmToken(
    emailConfirmToken: string,
  ): Promise<FindUserByEmailConfirmTokenRepositoryResult> {
    const user = await UserEntity.findOne({ where: { emailConfirmToken } });
    return this.adapt(user);
  }

  async findByEmail(email: string): Promise<FindUserByEmailRepositoryResult> {
    const user = await UserEntity.findOne({ where: { email } });
    return this.adapt(user);
  }

  private adapt(entity: UserEntity): any {
    return entity
      ? {
          id: entity.id,
          name: entity.name,
          surname: entity.surname,
          email: entity.email,
          password: entity.password,
          isAdmin: entity.isAdmin,
          emailConfirmedAt: entity.emailConfirmedAt,
          emailConfirmToken: entity.emailConfirmToken,
          passwordResetToken: entity.passwordResetToken,
        }
      : null;
  }
}
