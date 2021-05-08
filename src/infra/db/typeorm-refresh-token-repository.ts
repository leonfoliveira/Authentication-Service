import { CreateRefreshTokenRepository } from '@/application/interfaces';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';

export class TypeormRefreshTokenRepository implements CreateRefreshTokenRepository {
  async create(token: string, userId: string): Promise<void> {
    const refreshTokens = new RefreshTokensEntity();
    refreshTokens.token = token;
    refreshTokens.user = await UserEntity.findOne(userId);
    return this.adapt(await refreshTokens.save());
  }

  private adapt(refreshToken: RefreshTokensEntity): any {
    return refreshToken
      ? {
          id: refreshToken.id,
          user: refreshToken.user,
          token: refreshToken.token,
          issuedAt: refreshToken.issuedAt,
        }
      : null;
  }
}
