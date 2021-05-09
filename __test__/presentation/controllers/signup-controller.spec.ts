import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { EmailInUseException } from '@/domain/errors';
import { Signup } from '@/domain/usecases';
import { SignupController, SignupRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: SignupController;
  signupSpy: MockProxy<Signup>;
};

const makeSut = (): SutTypes => {
  const signupSpy = mock<Signup>({
    attempt: jest.fn().mockResolvedValue(mockUser()),
  });
  const sut = new SignupController(signupSpy);

  return { sut, signupSpy };
};

const mockRequest = (): HttpRequest<SignupRequest> => ({
  context: {},
  data: {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  },
});

describe('SignupController', () => {
  it('should call Signup with correct params', async () => {
    const { sut, signupSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(signupSpy.attempt).toHaveBeenCalledWith(request.data);
  });

  it('should return 201 with Signup protected response', async () => {
    const { sut, signupSpy } = makeSut();

    const response = await sut.handle(mockRequest());

    const user = await getAsyncReturn(signupSpy.attempt);
    expect(response).toEqual({
      statusCode: 201,
      body: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  });

  it('should return 409 if Signup throws EmailInUseException', async () => {
    const { sut, signupSpy } = makeSut();
    signupSpy.attempt.mockRejectedValueOnce(new EmailInUseException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 409);
  });

  it('should throw if Signup throws any other exception', async () => {
    const { sut, signupSpy } = makeSut();
    signupSpy.attempt.mockRejectedValueOnce(new Error());

    const promise = sut.handle(mockRequest());

    await expect(promise).rejects.toThrow(new Error());
  });
});
