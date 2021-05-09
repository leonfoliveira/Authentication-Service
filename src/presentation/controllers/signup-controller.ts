import { EmailInUseException } from '@/domain/errors';
import { Signup } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class SignupController implements Controller<SignupRequest> {
  constructor(private readonly signup: Signup) {}

  async handle(request: HttpRequest<SignupRequest>): Promise<HttpResponse> {
    try {
      const user = await this.signup.attempt(request.data);

      return HttpResponseFactory.makeCreated(protectUser(user));
    } catch (error) {
      if (error.name === EmailInUseException.name) {
        return HttpResponseFactory.makeConflict();
      }
      throw error;
    }
  }
}

export type SignupRequest = {
  name: string;
  surname: string;
  email: string;
  password: string;
};
