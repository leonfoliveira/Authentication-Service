import { User } from '@/domain/models';

export interface FindUserByRefreshTokenRepository {
  findUser: (token: string) => Promise<FindUserByRefreshTokenRepositoryResult>;
}

export type FindUserByRefreshTokenRepositoryResult = User;
