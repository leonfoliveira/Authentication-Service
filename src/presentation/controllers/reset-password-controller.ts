import { UserNotFoundException } from '@/domain/errors';
import { ResetPassword } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class ResetPasswordController implements Controller<ResetPasswordRequest> {
  constructor(private readonly resetPassword: ResetPassword) {}

  async handle(request: HttpRequest<ResetPasswordRequest>): Promise<HttpResponse> {
    try {
      await this.resetPassword.reset(request.data.userId);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type ResetPasswordRequest = {
  userId: string;
};
