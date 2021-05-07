import { User } from '@/domain/models';

export interface FindUserByRefreshTokenRepository {
  findByRefreshToken: (refreshToken: string) => Promise<FindUserByRefreshTokenRepositoryResult>;
}

export type FindUserByRefreshTokenRepositoryResult = User;
