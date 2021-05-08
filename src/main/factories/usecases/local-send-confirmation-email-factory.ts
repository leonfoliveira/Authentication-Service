import { LocalSendConfirmationEmail } from '@/application/usecases';
import env from '@/main/config/env';
import { makeNodemailerAdapter } from '@/main/factories/utils';

export const makeLocalSendConfirmationEmail = (): LocalSendConfirmationEmail =>
  new LocalSendConfirmationEmail(`${env.host}/confirm`, makeNodemailerAdapter());
