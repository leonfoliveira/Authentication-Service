import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { DeleteUser } from '@/domain/usecases';
import { DeleteUserController, DeleteUserRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';
import { mockUser } from '@/test/domain/models';

type SutTypes = {
  sut: DeleteUserController;
  deleteUserSpy: MockProxy<DeleteUser>;
};

const makeSut = (): SutTypes => {
  const deleteUserSpy = mock<DeleteUser>();
  const sut = new DeleteUserController(deleteUserSpy);

  return { sut, deleteUserSpy };
};

const mockRequest = (): HttpRequest<DeleteUserRequest> => {
  const id = faker.datatype.uuid();
  return {
    context: {
      user: { ...mockUser(), id },
    },
    data: {
      id,
    },
  };
};

describe('DeleteUserController', () => {
  it('should return 401 if the sender is not the target and not admin', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      ...mockRequest(),
      context: { user: { ...mockUser(), id: 'any', isAdmin: false } },
    });

    expect(response).toHaveProperty('statusCode', 401);
  });

  it('should call DeleteUserRequest with correct params', async () => {
    const { sut, deleteUserSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(deleteUserSpy.delete).toHaveBeenCalledWith(request.data.id);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({ statusCode: 204 });
  });

  it('should return 404 if DeleteUserRequest throws UserNotFoundException', async () => {
    const { sut, deleteUserSpy } = makeSut();
    deleteUserSpy.delete.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });

  it('should throw if DeleteUserRequest throws any other exception', async () => {
    const { sut, deleteUserSpy } = makeSut();
    deleteUserSpy.delete.mockRejectedValueOnce(new Error());

    const promise = sut.handle(mockRequest());

    await expect(promise).rejects.toThrow(new Error());
  });
});
