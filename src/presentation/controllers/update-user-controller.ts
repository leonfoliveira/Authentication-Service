import { UpdateUser } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class UpdateUserController implements Controller<UpdateUserRequest> {
  constructor(private readonly updateUser: UpdateUser) {}

  async handle(request: UpdateUserRequest): Promise<HttpResponse> {
    try {
      const { id, ...rest } = request;
      const user = await this.updateUser.update(id, rest);

      return HttpResponseFactory.makeOk(protectUser(user));
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type UpdateUserRequest = {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
};
