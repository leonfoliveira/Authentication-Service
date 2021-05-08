import { DbUpdateUser } from '@/application/usecases';
import { makeTypeormUserRepository } from '@/main/factories/db';

export const makeDbUpdateUser = (): DbUpdateUser =>
  new DbUpdateUser(
    makeTypeormUserRepository(),
    makeTypeormUserRepository(),
    makeTypeormUserRepository(),
  );
