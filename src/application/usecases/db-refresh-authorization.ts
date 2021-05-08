import { Authorization } from '@/domain/models';
import { GetAuthorization, RefreshAuthorization } from '@/domain/usecases';

import { FindUserByRefreshTokenRepository, RevokeRefreshTokenRepository } from '../interfaces';

export class DbRefreshAuthorization implements RefreshAuthorization {
  constructor(
    private readonly findUserByRefreshTokenRepository: FindUserByRefreshTokenRepository,
    private readonly revokeRefreshTokenRepository: RevokeRefreshTokenRepository,
    private readonly getAuthorizationSpy: GetAuthorization,
  ) {}

  async refresh(refreshToken: string): Promise<Authorization> {
    const user = await this.findUserByRefreshTokenRepository.findUser(refreshToken);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    await this.revokeRefreshTokenRepository.revoke(refreshToken);

    const authorization = await this.getAuthorizationSpy.get(user);

    return authorization;
  }
}
