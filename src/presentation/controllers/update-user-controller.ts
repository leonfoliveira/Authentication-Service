import { EmailInUseException, UserNotFoundException } from '@/domain/errors';
import { UpdateUser } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class UpdateUserController implements Controller<UpdateUserRequest> {
  constructor(private readonly updateUser: UpdateUser) {}

  async handle(request: HttpRequest<UpdateUserRequest>): Promise<HttpResponse> {
    try {
      const { id, ...rest } = request.data;
      const user = await this.updateUser.update(id, rest);

      return HttpResponseFactory.makeOk(protectUser(user));
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      if (error.name === EmailInUseException.name) {
        return HttpResponseFactory.makeConflict();
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
