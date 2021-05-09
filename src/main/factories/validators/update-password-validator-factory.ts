import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeUpdatePasswordValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      passwordResetToken: Joi.string().required(),
      password: Joi.string().min(8).required(),
    }),
  );
