import { RefreshTokensEntity, UserEntity } from '@/infra/entities';

export const mockRefreshToken = async (
  user: UserEntity,
  token = 'any_token',
): Promise<RefreshTokensEntity> => {
  const refreshToken = new RefreshTokensEntity();
  refreshToken.user = user;
  refreshToken.token = token;
  return refreshToken.save();
};
