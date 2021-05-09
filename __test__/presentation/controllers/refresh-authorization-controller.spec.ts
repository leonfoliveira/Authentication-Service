import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { RefreshAuthorization } from '@/domain/usecases';
import {
  RefreshAuthorizationController,
  RefreshAuthorizationRequest,
} from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';
import { mockAuthorization } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: RefreshAuthorizationController;
  refreshAuthorizationSpy: MockProxy<RefreshAuthorization>;
};

const makeSut = (): SutTypes => {
  const refreshAuthorizationSpy = mock<RefreshAuthorization>({
    refresh: jest.fn().mockResolvedValue(mockAuthorization()),
  });
  const sut = new RefreshAuthorizationController(refreshAuthorizationSpy);

  return { sut, refreshAuthorizationSpy };
};

const mockRequest = (): HttpRequest<RefreshAuthorizationRequest> => ({
  context: {},
  data: {
    refreshToken: faker.datatype.uuid(),
  },
});

describe('RefreshAuthorizationController', () => {
  it('should call RefreshAuthorization with correct params', async () => {
    const { sut, refreshAuthorizationSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(refreshAuthorizationSpy.refresh).toHaveBeenCalledWith(request.data.refreshToken);
  });

  it('should return 200 with RefreshAuthorization protected response', async () => {
    const { sut, refreshAuthorizationSpy } = makeSut();

    const response = await sut.handle(mockRequest());

    const authorization = await getAsyncReturn(refreshAuthorizationSpy.refresh);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        refreshToken: authorization.refreshToken,
        accessToken: authorization.accessToken,
        user: {
          id: authorization.user.id,
          name: authorization.user.name,
          surname: authorization.user.surname,
          email: authorization.user.email,
          isAdmin: authorization.user.isAdmin,
        },
      },
    });
  });

  it('should return 401 if RefreshAuthorization throws UserNotFoundException', async () => {
    const { sut, refreshAuthorizationSpy } = makeSut();
    refreshAuthorizationSpy.refresh.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 401);
  });
});
