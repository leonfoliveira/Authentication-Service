import { makeDbConfirmEmail } from '@/main/factories/usecases';
import { makeConfirmEmailValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { ConfirmEmailController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeConfirmEmailController = (): Controller =>
  new ValidationProxy(
    makeConfirmEmailValidator(),
    new ConfirmEmailController(makeDbConfirmEmail()),
  );
