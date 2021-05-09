import { UserNotFoundException } from '@/domain/errors';
import { ResetPassword } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class ResetPasswordController implements Controller {
  constructor(private readonly resetPassword: ResetPassword) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.resetPassword.reset(request.context.user.id);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}
