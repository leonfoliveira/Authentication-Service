import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeDeleteUserValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      id: Joi.string().required(),
    }),
  );
