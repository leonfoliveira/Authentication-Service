import { RefreshAuthorization } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/interfaces';

export class RefreshAuthorizationController implements Controller<RefreshAuthorizationRequest> {
  constructor(private readonly refreshAuthorization: RefreshAuthorization) {}

  async handle(request: RefreshAuthorizationRequest): Promise<HttpResponse> {
    try {
      const authorization = await this.refreshAuthorization.refresh(request.refreshToken);

      return HttpResponseFactory.makeOk({
        ...authorization,
        user: protectUser(authorization.user),
      });
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        return HttpResponseFactory.makeUnauthorized();
      }
      throw error;
    }
  }
}

export type RefreshAuthorizationRequest = {
  refreshToken: string;
};
