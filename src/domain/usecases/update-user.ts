import { User } from '@/domain/models';

export interface UpdateUser {
  update: (id: string, params: UpdateUserDTO) => Promise<User>;
}

export type UpdateUserDTO = {
  name?: string;
  surname?: string;
  email?: string;
};
