import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeUpdateUserValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().max(32).optional().trim(),
      surname: Joi.string().max(64).optional().trim(),
      email: Joi.string().email().optional().trim(),
    }),
  );
