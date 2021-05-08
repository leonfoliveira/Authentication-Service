import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeSignupValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      name: Joi.string().max(32).required().trim(),
      surname: Joi.string().max(64).required().trim(),
      email: Joi.string().email().required().trim(),
      password: Joi.string().required(),
    }),
  );
