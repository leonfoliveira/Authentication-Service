import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { FindUserRepository, DeleteUserRepository } from '@/application/interfaces';
import { DbDeleteUser } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';

type SutTypes = {
  sut: DbDeleteUser;
  findUserRepositorySpy: MockProxy<FindUserRepository>;
  deleteUserRepositorySpy: MockProxy<DeleteUserRepository>;
};

const makeSut = (): SutTypes => {
  const findUserRepositorySpy = mock<FindUserRepository>({
    find: jest.fn().mockResolvedValue(mockUser()),
  });
  const deleteUserRepositorySpy = mock<DeleteUserRepository>();
  const sut = new DbDeleteUser(findUserRepositorySpy, deleteUserRepositorySpy);

  return { sut, findUserRepositorySpy, deleteUserRepositorySpy };
};

const mockDTO = faker.datatype.uuid;

describe('DbDeleteUserRepository', () => {
  it('should call FindUserRepository with correct params', async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    const id = faker.datatype.uuid();

    await sut.delete(id);

    expect(findUserRepositorySpy.find).toHaveBeenCalledWith(id);
  });

  it('should throw if FindUserRepository returns null', async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    findUserRepositorySpy.find.mockResolvedValueOnce(null);

    const promise = sut.delete(mockDTO());

    await expect(promise).rejects.toThrow(new Error('USER_NOT_FOUND'));
  });

  it('should call DeleteUserRepository with correct params', async () => {
    const { sut, deleteUserRepositorySpy } = makeSut();
    const id = mockDTO();

    await sut.delete(id);

    expect(deleteUserRepositorySpy.delete).toHaveBeenCalledWith(id);
  });
});
