import { makeLocalDecodeAccessToken } from '@/main/factories/usecases';
import { AuthMiddleware } from '@/presentation/middlewares';

export const makeAuthMiddleware = (isAdminRequired = false): AuthMiddleware =>
  new AuthMiddleware(makeLocalDecodeAccessToken(), isAdminRequired);
