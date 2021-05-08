import { Signin } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class SigninController implements Controller<SigninRequest> {
  constructor(private readonly signin: Signin) {}

  async handle(request: SigninRequest): Promise<HttpResponse> {
    try {
      const authorization = await this.signin.attempt(request);

      return HttpResponseFactory.makeOk({
        ...authorization,
        user: protectUser(authorization.user),
      });
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND' || error.message === 'INCORRECT_PASSWORD') {
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
