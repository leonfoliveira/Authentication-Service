import { UserNotFoundException } from '@/domain/errors';
import { DeleteUser } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class DeleteUserController implements Controller<DeleteUserRequest> {
  constructor(private readonly deleteUser: DeleteUser) {}

  async handle(request: DeleteUserRequest): Promise<HttpResponse> {
    try {
      await this.deleteUser.delete(request.id);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type DeleteUserRequest = {
  id: string;
};
