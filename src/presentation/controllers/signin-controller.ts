import { IncorrectPasswordException, UserNotFoundException } from '@/domain/errors';
import { Signin } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class SigninController implements Controller<SigninRequest> {
  constructor(private readonly signin: Signin) {}

  async handle(request: HttpRequest<SigninRequest>): Promise<HttpResponse> {
    try {
      const authorization = await this.signin.attempt(request.data);

      return HttpResponseFactory.makeOk({
        ...authorization,
        user: protectUser(authorization.user),
      });
    } catch (error) {
      if (
        error.name === UserNotFoundException.name ||
        error.name === IncorrectPasswordException.name
      ) {
        return HttpResponseFactory.makeUnauthorized();
      }
      throw error;
    }
  }
}

export type SigninRequest = {
  email: string;
  password: string;
};
