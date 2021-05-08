import { DbSignin } from '@/application/usecases';
import { makeBcryptAdapter } from '@/main/factories/cryptography';
import { makeTypeormUserRepository } from '@/main/factories/db';

import { makeDbGetAuthorization } from './db-get-authorization-factory';

export const makeDbSignin = (): DbSignin =>
  new DbSignin(makeTypeormUserRepository(), makeBcryptAdapter(), makeDbGetAuthorization());
