import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { EmailInUseException, UserNotFoundException } from '@/domain/errors';
import { UpdateUser } from '@/domain/usecases';
import { UpdateUserController, UpdateUserRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: UpdateUserController;
  updateUserSpy: MockProxy<UpdateUser>;
};

const makeSut = (): SutTypes => {
  const updateUserSpy = mock<UpdateUser>({
    update: jest.fn().mockResolvedValue(mockUser()),
  });
  const sut = new UpdateUserController(updateUserSpy);

  return { sut, updateUserSpy };
};

const mockRequest = (): HttpRequest<UpdateUserRequest> => {
  const id = faker.datatype.uuid();
  return {
    context: {
      user: { ...mockUser(), id },
    },
    data: {
      id,
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
    },
  };
};

describe('UpdateUserController', () => {
  it('should return 401 if the sender is not the target and not admin', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      ...mockRequest(),
      context: { user: { ...mockUser(), id: 'any', isAdmin: false } },
    });

    expect(response).toHaveProperty('statusCode', 401);
  });

  it('should call UpdateUser with correct params', async () => {
    const { sut, updateUserSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    const { id, ...rest } = request.data;
    expect(updateUserSpy.update).toHaveBeenCalledWith(id, rest);
  });

  it('should return 200 with UpdateUser protected response', async () => {
    const { sut, updateUserSpy } = makeSut();

    const response = await sut.handle(mockRequest());

    const user = await getAsyncReturn(updateUserSpy.update);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  });

  it('should return 404 if UpdateUser throws UserNotFoundException', async () => {
    const { sut, updateUserSpy } = makeSut();
    updateUserSpy.update.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });

  it('should return 409 if UpdateUser throws EmailInUseException', async () => {
    const { sut, updateUserSpy } = makeSut();
    updateUserSpy.update.mockRejectedValueOnce(new EmailInUseException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 409);
  });

  it('should throw if UpdateUser throws any other exception', async () => {
    const { sut, updateUserSpy } = makeSut();
    updateUserSpy.update.mockRejectedValueOnce(new Error());

    const promise = sut.handle(mockRequest());

    await expect(promise).rejects.toThrow(new Error());
  });
});
