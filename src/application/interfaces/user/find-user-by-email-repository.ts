import { User } from '@/domain/models';

export interface FindUserByEmailRepository {
  findByEmail: (email: string) => Promise<FindUserByEmailRepositoryResult>;
}

export type FindUserByEmailRepositoryResult = User;
