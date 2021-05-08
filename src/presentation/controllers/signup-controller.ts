import { Signup } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class SignupController implements Controller<SignupRequest> {
  constructor(private readonly signup: Signup) {}

  async handle(request: SignupRequest): Promise<HttpResponse> {
    try {
      const user = await this.signup.attempt(request);

      return HttpResponseFactory.makeCreated(protectUser(user));
    } catch (error) {
      if (error.message === 'EMAIL_IN_USE') {
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
