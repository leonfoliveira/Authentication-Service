import { DbDeleteUser } from '@/application/usecases';
import { makeTypeormUserRepository } from '@/main/factories/db';

export const makeDbDeleteUser = (): DbDeleteUser =>
  new DbDeleteUser(makeTypeormUserRepository(), makeTypeormUserRepository());
