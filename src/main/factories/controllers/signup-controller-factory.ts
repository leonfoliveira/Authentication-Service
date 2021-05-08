import { makeDbSignup } from '@/main/factories/usecases';
import { makeSignupValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { SignupController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeSignupController = (): Controller =>
  new ValidationProxy(makeSignupValidator(), new SignupController(makeDbSignup()));
