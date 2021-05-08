import { UpdatePassword } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class UpdatePasswordController implements Controller<UpdatePasswordRequest> {
  constructor(private readonly updatePassword: UpdatePassword) {}

  async handle(request: UpdatePasswordRequest): Promise<HttpResponse> {
    try {
      await this.updatePassword.update(request.passwordResetToken, request.password);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
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
