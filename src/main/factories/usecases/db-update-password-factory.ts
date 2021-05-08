import { DbUpdatePassword } from '@/application/usecases';
import { makeBcryptAdapter } from '@/main/factories/cryptography';
import { makeTypeormRefreshTokenRepository, makeTypeormUserRepository } from '@/main/factories/db';

export const makeDbUpdatePassword = (): DbUpdatePassword =>
  new DbUpdatePassword(
    makeTypeormUserRepository(),
    makeBcryptAdapter(),
    makeTypeormUserRepository(),
    makeTypeormRefreshTokenRepository(),
  );
