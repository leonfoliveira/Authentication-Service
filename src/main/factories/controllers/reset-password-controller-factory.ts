import { makeDbResetPassword } from '@/main/factories/usecases';
import { ResetPasswordController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeResetPasswordController = (): Controller =>
  new ResetPasswordController(makeDbResetPassword());
