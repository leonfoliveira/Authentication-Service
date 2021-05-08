import { makeDbResetPassword } from '@/main/factories/usecases';
import { makeResetPasswordValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { ResetPasswordController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeResetPasswordController = (): Controller =>
  new ValidationProxy(
    makeResetPasswordValidator(),
    new ResetPasswordController(makeDbResetPassword()),
  );
