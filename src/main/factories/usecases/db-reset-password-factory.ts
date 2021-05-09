import { DbResetPassword } from '@/application/usecases';
import { makeUuidAdapter } from '@/main/factories/cryptography';
import { makeTypeormUserRepository } from '@/main/factories/db';

import { makeLocalSendPasswordResetEmail } from './local-send-password-reset-email-factory';

export const makeDbResetPassword = (): DbResetPassword =>
  new DbResetPassword(
    makeTypeormUserRepository(),
    makeUuidAdapter(),
    makeTypeormUserRepository(),
    makeLocalSendPasswordResetEmail(),
  );
