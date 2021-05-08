import { makeDbUpdatePassword } from '@/main/factories/usecases';
import { makeUpdatePasswordValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { UpdatePasswordController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeUpdatePasswordController = (): Controller =>
  new ValidationProxy(
    makeUpdatePasswordValidator(),
    new UpdatePasswordController(makeDbUpdatePassword()),
  );
