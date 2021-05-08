import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeGrantAdminValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      userId: Joi.string().required(),
    }),
  );
