import { UserNotFoundException } from '@/domain/errors';
import { UpdatePassword } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class UpdatePasswordController implements Controller<UpdatePasswordRequest> {
  constructor(private readonly updatePassword: UpdatePassword) {}

  async handle(request: HttpRequest<UpdatePasswordRequest>): Promise<HttpResponse> {
    try {
      await this.updatePassword.update(request.data.passwordResetToken, request.data.password);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type UpdatePasswordRequest = {
  passwordResetToken: string;
  password: string;
};
