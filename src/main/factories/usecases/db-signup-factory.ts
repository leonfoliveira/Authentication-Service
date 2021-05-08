import { DbSignup } from '@/application/usecases';
import { makeBcryptAdapter, makeUuidAdapter } from '@/main/factories/cryptography';
import { makeTypeormUserRepository } from '@/main/factories/db';

import { makeLocalSendConfirmationEmail } from './local-send-confirmation-email-factory';

export const makeDbSignup = (): DbSignup =>
  new DbSignup(
    makeTypeormUserRepository(),
    makeBcryptAdapter(),
    makeUuidAdapter(),
    makeTypeormUserRepository(),
    makeLocalSendConfirmationEmail(),
  );
