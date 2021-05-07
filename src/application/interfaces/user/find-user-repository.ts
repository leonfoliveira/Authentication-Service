import { User } from '@/domain/models';

export interface FindUserRepository {
  find: (id: string) => Promise<FindUserRepositoryResult>;
}

export type FindUserRepositoryResult = User;
