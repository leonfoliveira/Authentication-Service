import Joi from 'joi';

import { Validator, ValidatorResult } from '@/application/interfaces';

export class JoiAdapter implements Validator {
  constructor(private readonly schema: Joi.Schema) {}

  validate(data: any): ValidatorResult {
    const { value, error } = this.schema.validate(data, { stripUnknown: true });
    return { sanitizedData: value, error: error ? new Error(error.message) : null };
  }
}
