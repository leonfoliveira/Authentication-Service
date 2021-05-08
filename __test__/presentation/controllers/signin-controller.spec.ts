import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { Signin } from '@/domain/usecases';
import { SigninController, SigninRequest } from '@/presentation/controllers';
import { mockAuthorization } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: SigninController;
  signinSpy: MockProxy<Signin>;
};

const makeSut = (): SutTypes => {
  const signinSpy = mock<Signin>({
    attempt: jest.fn().mockResolvedValue(mockAuthorization()),
  });
  const sut = new SigninController(signinSpy);

  return { sut, signinSpy };
};

const mockRequest = (): SigninRequest => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

describe('SigninController', () => {
  it('should call Signin with correct params', async () => {
    const { sut, signinSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(signinSpy.attempt).toHaveBeenCalledWith(request);
  });

  it('should return 200 with Signin protected response', async () => {
    const { sut, signinSpy } = makeSut();

    const response = await sut.handle(mockRequest());

    const authorization = await getAsyncReturn(signinSpy.attempt);
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

  it('should return 401 if Signin throws USER_NOT_FOUND', async () => {
    const { sut, signinSpy } = makeSut();
    signinSpy.attempt.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 401);
  });

  it('should return 401 if Signin throws INCORRECT_PASSWORD', async () => {
    const { sut, signinSpy } = makeSut();
    signinSpy.attempt.mockRejectedValueOnce(new Error('INCORRECT_PASSWORD'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 401);
  });
});
