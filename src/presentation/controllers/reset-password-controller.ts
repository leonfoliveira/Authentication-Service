import { ResetPassword } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class ResetPasswordController implements Controller<ResetPasswordRequest> {
  constructor(private readonly resetPassword: ResetPassword) {}

  async handle(request: ResetPasswordRequest): Promise<HttpResponse> {
    try {
      await this.resetPassword.reset(request.userId);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type ResetPasswordRequest = {
  userId: string;
};
