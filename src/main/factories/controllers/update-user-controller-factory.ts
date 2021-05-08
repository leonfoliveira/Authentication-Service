import { makeDbUpdateUser } from '@/main/factories/usecases';
import { makeUpdateUserValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { UpdateUserController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeUpdateUserController = (): Controller =>
  new ValidationProxy(makeUpdateUserValidator(), new UpdateUserController(makeDbUpdateUser()));
