import { TypeormRefreshTokenRepository } from '@/infra/db';

export const makeTypeormRefreshTokenRepository = (): TypeormRefreshTokenRepository =>
  new TypeormRefreshTokenRepository();
