import { EmailAlreadyConfirmedException, UserNotFoundException } from '@/domain/errors';
import { ConfirmEmail } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class ConfirmEmailController implements Controller<ConfirmEmailRequest> {
  constructor(private readonly confirmEmail: ConfirmEmail) {}

  async handle(request: ConfirmEmailRequest): Promise<HttpResponse> {
    try {
      await this.confirmEmail.confirm(request.emailConfirmToken);
      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      if (error.name === EmailAlreadyConfirmedException.name) {
        return HttpResponseFactory.makeBadRequest('Email is already confirmed.');
      }
      throw error;
    }
  }
}

export type ConfirmEmailRequest = {
  emailConfirmToken: string;
};
