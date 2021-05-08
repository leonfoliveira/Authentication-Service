import { Validator } from '@/application/interfaces';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class ValidationProxy implements Controller {
  constructor(private readonly validator: Validator, private readonly controller: Controller) {}

  async handle(request: any): Promise<HttpResponse> {
    const { sanitizedData, error } = this.validator.validate(request);
    if (error) {
      return { statusCode: 400, body: { message: error.message } };
    }

    return this.controller.handle(sanitizedData);
  }
}
