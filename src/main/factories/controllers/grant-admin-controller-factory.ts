import { makeDbGrantAdmin } from '@/main/factories/usecases';
import { makeGrantAdminValidator } from '@/main/factories/validators';
import { ValidationProxy } from '@/main/utils';
import { GrantAdminController } from '@/presentation/controllers';
import { Controller } from '@/presentation/interfaces';

export const makeGrantAdminController = (): Controller =>
  new ValidationProxy(makeGrantAdminValidator(), new GrantAdminController(makeDbGrantAdmin()));
