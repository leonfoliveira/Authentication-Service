import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { GrantAdmin } from '@/domain/usecases';
import { GrantAdminController, GrantAdminRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';

type SutTypes = {
  sut: GrantAdminController;
  grantAdminSpy: MockProxy<GrantAdmin>;
};

const makeSut = (): SutTypes => {
  const grantAdminSpy = mock<GrantAdmin>();
  const sut = new GrantAdminController(grantAdminSpy);

  return { sut, grantAdminSpy };
};

const mockRequest = (): HttpRequest<GrantAdminRequest> => ({
  context: {},
  data: {
    userId: faker.datatype.uuid(),
  },
});

describe('GrantAdminController', () => {
  it('should call GrantAdmin with correct params', async () => {
    const { sut, grantAdminSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(grantAdminSpy.grant).toHaveBeenCalledWith(request.data.userId);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({ statusCode: 204 });
  });

  it('should return 404 if GrantAdmin throws UserNotFoundException', async () => {
    const { sut, grantAdminSpy } = makeSut();
    grantAdminSpy.grant.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });

  it('should throw if GrantAdmin throws any other exception', async () => {
    const { sut, grantAdminSpy } = makeSut();
    grantAdminSpy.grant.mockRejectedValueOnce(new Error());

    const promise = sut.handle(mockRequest());

    await expect(promise).rejects.toThrow(new Error());
  });
});
