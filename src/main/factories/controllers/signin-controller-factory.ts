import { makeDbSignin } from '@/main/factories/usecases';
import { makeSigninValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { SigninController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeSigninController = (): Controller =>
  new ValidationProxy(makeSigninValidator(), new SigninController(makeDbSignin()));
