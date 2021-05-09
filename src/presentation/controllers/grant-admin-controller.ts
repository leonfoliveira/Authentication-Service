import { UserNotFoundException } from '@/domain/errors';
import { GrantAdmin } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class GrantAdminController implements Controller<GrantAdminRequest> {
  constructor(private readonly grantAdmin: GrantAdmin) {}

  async handle(request: HttpRequest<GrantAdminRequest>): Promise<HttpResponse> {
    try {
      await this.grantAdmin.grant(request.data.userId);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type GrantAdminRequest = {
  userId: string;
};
