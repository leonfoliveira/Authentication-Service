import { LocalDecodeAccessToken } from '@/application/usecases';
import { makeJwtAdapter } from '@/main/factories/cryptography';

export const makeLocalDecodeAccessToken = (): LocalDecodeAccessToken =>
  new LocalDecodeAccessToken(makeJwtAdapter());
