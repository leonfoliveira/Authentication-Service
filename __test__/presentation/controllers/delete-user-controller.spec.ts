import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { DeleteUser } from '@/domain/usecases';
import { DeleteUserController, DeleteUserRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';

type SutTypes = {
  sut: DeleteUserController;
  deleteUserSpy: MockProxy<DeleteUser>;
};

const makeSut = (): SutTypes => {
  const deleteUserSpy = mock<DeleteUser>();
  const sut = new DeleteUserController(deleteUserSpy);

  return { sut, deleteUserSpy };
};

const mockRequest = (): HttpRequest<DeleteUserRequest> => ({
  context: {},
  data: {
    id: faker.datatype.uuid(),
  },
});

describe('DeleteUserController', () => {
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
});
