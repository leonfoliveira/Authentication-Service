import { DbResetPassword } from '@/application/usecases';
import { makeUuidAdapter } from '@/main/factories/cryptography';
import { makeTypeormUserRepository } from '@/main/factories/db';

import { makeLocalSendConfirmationEmail } from './local-send-confirmation-email-factory';

export const makeDbResetPassword = (): DbResetPassword =>
  new DbResetPassword(
    makeTypeormUserRepository(),
    makeUuidAdapter(),
    makeTypeormUserRepository(),
    makeLocalSendConfirmationEmail(),
  );
