import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UpdateUser } from '@/domain/usecases';
import { UpdateUserController, UpdateUserRequest } from '@/presentation/controllers';
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

const mockRequest = (): UpdateUserRequest => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
});

describe('UpdateUserController', () => {
  it('should call UpdateUser with correct params', async () => {
    const { sut, updateUserSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    const { id, ...rest } = request;
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

  it('should return 404 if UpdateUser throws USER_NOT_FOUND', async () => {
    const { sut, updateUserSpy } = makeSut();
    updateUserSpy.update.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });
});
