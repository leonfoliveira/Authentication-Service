import { Validator } from '@/application/interfaces';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class ValidationProxy implements Controller {
  constructor(private readonly validator: Validator, private readonly controller: Controller) {}

  async handle(request: HttpRequest<any>): Promise<HttpResponse> {
    const { sanitizedData, error } = this.validator.validate(request.data);
    if (error) {
      return { statusCode: 400, body: { message: error.message } };
    }

    return this.controller.handle({ context: request.context, data: sanitizedData });
  }
}
