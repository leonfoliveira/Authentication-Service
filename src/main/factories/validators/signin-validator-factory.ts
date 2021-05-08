import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeSigninValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  );
