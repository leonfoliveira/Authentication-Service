import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeResetPasswordValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      userId: Joi.string().required(),
    }),
  );
