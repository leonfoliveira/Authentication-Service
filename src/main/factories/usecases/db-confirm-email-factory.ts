import { DbConfirmEmail } from '@/application/usecases';
import { makeTypeormUserRepository } from '@/main/factories/db';

export const makeDbConfirmEmail = (): DbConfirmEmail =>
  new DbConfirmEmail(makeTypeormUserRepository(), makeTypeormUserRepository());
