import { TransportOptions } from 'nodemailer';

import { NodemailerAdapter } from '@/infra/utils';
import env from '@/main/config/env';

export const makeNodemailerAdapter = (): NodemailerAdapter =>
  new NodemailerAdapter(env.nodemailerSender, env.nodemailerOptions as TransportOptions);
