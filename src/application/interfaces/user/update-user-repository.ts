import { User } from '@/domain/models';

export interface UpdateUserRepository {
  update: (id: string, params: UpdateUserRepositoryDTO) => Promise<UpdateUserRepositoryResult>;
}

export type UpdateUserRepositoryDTO = {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  passwordResetToken?: string;
};

export type UpdateUserRepositoryResult = User;
