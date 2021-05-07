import { User } from '@/domain/models';

export interface FindUserByEmailConfirmTokenRepository {
  findByEmailConfirmToken: (
    emailConfirmToken: string,
  ) => Promise<FindUserByEmailConfirmTokenRepositoryResult>;
}

export type FindUserByEmailConfirmTokenRepositoryResult = User;
