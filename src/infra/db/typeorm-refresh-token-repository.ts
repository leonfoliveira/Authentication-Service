import {
  CreateRefreshTokenRepository,
  FindUserByRefreshTokenRepository,
  FindUserByRefreshTokenRepositoryResult,
} from '@/application/interfaces';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';

export class TypeormRefreshTokenRepository
  implements CreateRefreshTokenRepository, FindUserByRefreshTokenRepository {
  async create(token: string, userId: string): Promise<void> {
    const refreshTokens = new RefreshTokensEntity();
    refreshTokens.token = token;
    refreshTokens.user = await UserEntity.findOne(userId);
    return this.adapt(await refreshTokens.save());
  }

  async findUser(token: string): Promise<FindUserByRefreshTokenRepositoryResult> {
    const entity = await RefreshTokensEntity.findOne({ where: { token }, relations: ['user'] });
    return this.adaptUser(entity.user);
  }

  private adapt(entity: RefreshTokensEntity): any {
    return entity
      ? {
          id: entity.id,
          user: entity.user,
          token: entity.token,
          issuedAt: entity.issuedAt,
        }
      : null;
  }

  private adaptUser(entity: UserEntity): any {
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
