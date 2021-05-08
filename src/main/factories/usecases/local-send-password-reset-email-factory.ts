import { LocalSendPasswordResetEmail } from '@/application/usecases';
import env from '@/main/config/env';
import { makeNodemailerAdapter } from '@/main/factories/utils';

export const makeLocalSendPasswordResetEmail = (): LocalSendPasswordResetEmail =>
  new LocalSendPasswordResetEmail(`${env.host}/password`, makeNodemailerAdapter());
