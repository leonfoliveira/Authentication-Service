import { DecodeAccessToken } from '@/domain/usecases';
import { HttpResponseFactory } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';

export class AuthMiddleware implements Controller<AuthRequest> {
  constructor(
    private readonly decodeAccessToken: DecodeAccessToken,
    private readonly isAdminRequired = false,
  ) {}

  async handle(request: HttpRequest<AuthRequest>): Promise<HttpResponse> {
    if (!request.data.authorization) {
      return HttpResponseFactory.makeUnauthorized();
    }

    if (!/^Bearer .+/.test(request.data.authorization)) {
      return HttpResponseFactory.makeUnauthorized();
    }

    const accessToken = request.data.authorization.replace('Bearer ', '');
    const user = this.decodeAccessToken.decode(accessToken);

    if (!user) {
      return HttpResponseFactory.makeUnauthorized();
    }

    if (this.isAdminRequired && !user.isAdmin) {
      return HttpResponseFactory.makeUnauthorized();
    }

    return HttpResponseFactory.makeOk(user);
  }
}

export type AuthRequest = {
  authorization?: string;
};
