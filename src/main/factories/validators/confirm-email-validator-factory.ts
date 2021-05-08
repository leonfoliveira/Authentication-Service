import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeConfirmEmailValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      emailConfirmToken: Joi.string().required(),
    }),
  );
