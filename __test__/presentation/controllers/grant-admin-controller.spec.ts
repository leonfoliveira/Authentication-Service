import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { GrantAdmin } from '@/domain/usecases';
import { GrantAdminController, GrantAdminRequest } from '@/presentation/controllers';

type SutTypes = {
  sut: GrantAdminController;
  grantAdminSpy: MockProxy<GrantAdmin>;
};

const makeSut = (): SutTypes => {
  const grantAdminSpy = mock<GrantAdmin>();
  const sut = new GrantAdminController(grantAdminSpy);

  return { sut, grantAdminSpy };
};

const mockRequest = (): GrantAdminRequest => ({
  userId: faker.datatype.uuid(),
});

describe('GrantAdminController', () => {
  it('should call GrantAdmin with correct params', async () => {
    const { sut, grantAdminSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(grantAdminSpy.grant).toHaveBeenCalledWith(request.userId);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({ statusCode: 204 });
  });

  it('should return 404 if GrantAdmin throws USER_NOT_FOUND', async () => {
    const { sut, grantAdminSpy } = makeSut();
    grantAdminSpy.grant.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });
});
