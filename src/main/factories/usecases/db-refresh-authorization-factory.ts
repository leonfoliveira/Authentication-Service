import { DbRefreshAuthorization } from '@/application/usecases';
import { makeTypeormRefreshTokenRepository } from '@/main/factories/db';

import { makeDbGetAuthorization } from './db-get-authorization-factory';

export const makeDbRefreshAuthorization = (): DbRefreshAuthorization =>
  new DbRefreshAuthorization(
    makeTypeormRefreshTokenRepository(),
    makeTypeormRefreshTokenRepository(),
    makeDbGetAuthorization(),
  );
