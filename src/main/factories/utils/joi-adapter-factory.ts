import Joi from 'joi';

import { JoiAdapter } from '@/infra/utils';

export const makeJoiAdapter = (schema: Joi.Schema): JoiAdapter => new JoiAdapter(schema);
