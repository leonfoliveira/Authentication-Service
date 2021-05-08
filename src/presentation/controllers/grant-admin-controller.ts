import { GrantAdmin } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class GrantAdminController implements Controller<GrantAdminRequest> {
  constructor(private readonly grantAdmin: GrantAdmin) {}

  async handle(request: GrantAdminRequest): Promise<HttpResponse> {
    try {
      await this.grantAdmin.grant(request.userId);

      return HttpResponseFactory.makeNoContent();
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        return HttpResponseFactory.makeNotFound();
      }
      throw error;
    }
  }
}

export type GrantAdminRequest = {
  userId: string;
};