import { TypeormRefreshTokenRepository } from '@/infra/db';
import env from '@/main/config/env';

export const makeTypeormRefreshTokenRepository = (): TypeormRefreshTokenRepository =>
  new TypeormRefreshTokenRepository(env.refreshTokenExpiration);
