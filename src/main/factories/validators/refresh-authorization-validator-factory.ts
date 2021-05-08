import Joi from 'joi';

import { Validator } from '@/application/interfaces';
import { makeJoiAdapter } from '@/main/factories/utils';

export const makeRefreshAuthorizationValidator = (): Validator =>
  makeJoiAdapter(
    Joi.object({
      refreshToken: Joi.string().required(),
    }),
  );
