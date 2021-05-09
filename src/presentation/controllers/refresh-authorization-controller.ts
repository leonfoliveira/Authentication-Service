import { UserNotFoundException } from '@/domain/errors';
import { RefreshAuthorization } from '@/domain/usecases';
import { HttpResponseFactory, protectUser } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class RefreshAuthorizationController implements Controller<RefreshAuthorizationRequest> {
  constructor(private readonly refreshAuthorization: RefreshAuthorization) {}

  async handle(request: HttpRequest<RefreshAuthorizationRequest>): Promise<HttpResponse> {
    try {
      const authorization = await this.refreshAuthorization.refresh(request.data.refreshToken);

      return HttpResponseFactory.makeOk({
        ...authorization,
        user: protectUser(authorization.user),
      });
    } catch (error) {
      if (error.name === UserNotFoundException.name) {
        return HttpResponseFactory.makeUnauthorized();
      }
      throw error;
    }
  }
}

export type RefreshAuthorizationRequest = {
  refreshToken: string;
};
