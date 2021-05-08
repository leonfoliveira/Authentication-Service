import { makeDbDeleteUser } from '@/main/factories/usecases';
import { makeDeleteUserValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { DeleteUserController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeDeleteUserController = (): Controller =>
  new ValidationProxy(makeDeleteUserValidator(), new DeleteUserController(makeDbDeleteUser()));
