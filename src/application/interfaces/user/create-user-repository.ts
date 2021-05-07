import { User } from '@/domain/models';

export interface CreateUserRepository {
  create: (params: CreateUserRepositoryDTO) => Promise<CreateUserRepositoryResult>;
}

export type CreateUserRepositoryDTO = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export type CreateUserRepositoryResult = User;
