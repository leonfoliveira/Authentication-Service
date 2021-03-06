import { MoreThanOrEqual } from 'typeorm';

import {
  CreateRefreshTokenRepository,
  FindUserByRefreshTokenRepository,
  FindUserByRefreshTokenRepositoryResult,
  RevokeAllRefreshTokensByUserRepository,
  RevokeRefreshTokenRepository,
} from '@/application/interfaces';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';

export class TypeormRefreshTokenRepository
  implements
    CreateRefreshTokenRepository,
    FindUserByRefreshTokenRepository,
    RevokeAllRefreshTokensByUserRepository,
    RevokeRefreshTokenRepository {
  constructor(private readonly refreshTokenExpiration: number) {}

  async create(token: string, userId: string): Promise<void> {
    const refreshTokens = new RefreshTokensEntity();
    refreshTokens.token = token;
    refreshTokens.user = await UserEntity.findOne(userId);
    await refreshTokens.save();
  }

  async findUser(token: string): Promise<FindUserByRefreshTokenRepositoryResult> {
    const entity = await RefreshTokensEntity.findOne({
      where: {
        token,
        issuedAt: MoreThanOrEqual(new Date(Date.now() - 1000 * this.refreshTokenExpiration)),
      },
      relations: ['user'],
    });
    /* istanbul ignore next */
    return this.adaptUser(entity?.user);
  }

  async revokeAll(userId: string): Promise<void> {
    await RefreshTokensEntity.delete({ user: { id: userId } });
  }

  async revoke(token: string): Promise<void> {
    await RefreshTokensEntity.delete({ token });
  }

  private adaptUser(entity: UserEntity): any {
    /* istanbul ignore next */
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
