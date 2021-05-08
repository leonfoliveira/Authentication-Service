import { DbGetAuthorization } from '@/application/usecases';
import { makeJwtAdapter, makeUuidAdapter } from '@/main/factories/cryptography';
import { makeTypeormRefreshTokenRepository } from '@/main/factories/db';

export const makeDbGetAuthorization = (): DbGetAuthorization =>
  new DbGetAuthorization(makeUuidAdapter(), makeJwtAdapter(), makeTypeormRefreshTokenRepository());
