import {
  CreateUserRepository,
  CreateUserRepositoryDTO,
  CreateUserRepositoryResult,
  DeleteUserRepository,
  FindUserByEmailConfirmTokenRepository,
  FindUserByEmailConfirmTokenRepositoryResult,
  FindUserByEmailRepository,
  FindUserByEmailRepositoryResult,
  FindUserByPasswordResetTokenRepository,
  FindUserByPasswordResetTokenRepositoryResult,
  FindUserRepository,
  FindUserRepositoryResult,
  UpdateUserRepository,
  UpdateUserRepositoryDTO,
  UpdateUserRepositoryResult,
  UserConfirmEmailRepository,
  UserGrantAdminRepository,
} from '@/application/interfaces';
import { UserEntity } from '@/infra/entities';

export class TypeormUserRepository
  implements
    CreateUserRepository,
    DeleteUserRepository,
    FindUserByEmailConfirmTokenRepository,
    FindUserByEmailRepository,
    FindUserByPasswordResetTokenRepository,
    FindUserRepository,
    UpdateUserRepository,
    UserConfirmEmailRepository,
    UserGrantAdminRepository {
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

  async findByPasswordResetToken(
    passwordResetToken: string,
  ): Promise<FindUserByPasswordResetTokenRepositoryResult> {
    const user = await UserEntity.findOne({ where: { passwordResetToken } });
    return this.adapt(user);
  }

  async find(id: string): Promise<FindUserRepositoryResult> {
    const user = await UserEntity.findOne(id);
    return this.adapt(user);
  }

  async update(id: string, params: UpdateUserRepositoryDTO): Promise<UpdateUserRepositoryResult> {
    const user = await UserEntity.findOne(id);
    if (params.name) user.name = params.name;
    if (params.surname) user.surname = params.surname;
    if (params.email) user.email = params.email;
    if (params.password) user.password = params.password;
    if (params.passwordResetToken) user.passwordResetToken = params.passwordResetToken;
    return this.adapt(await user.save());
  }

  async confirmEmail(id: string): Promise<void> {
    const user = await UserEntity.findOne(id);
    user.emailConfirmedAt = new Date();
    await user.save();
  }

  async grant(id: string): Promise<void> {
    const user = await UserEntity.findOne(id);
    user.isAdmin = true;
    await user.save();
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
