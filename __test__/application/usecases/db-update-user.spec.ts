import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { FindUserRepository, UpdateUserRepository } from '@/application/interfaces';
import { DbUpdateUser } from '@/application/usecases';
import { UpdateUserDTO } from '@/domain/usecases';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbUpdateUser;
  findUserRepositorySpy: MockProxy<FindUserRepository>;
  updateUserRepositorySpy: MockProxy<UpdateUserRepository>;
};

const makeSut = (): SutTypes => {
  const findUserRepositorySpy = mock<FindUserRepository>({
    find: jest.fn().mockResolvedValue(mockUser()),
  });
  const updateUserRepositorySpy = mock<UpdateUserRepository>();
  const sut = new DbUpdateUser(findUserRepositorySpy, updateUserRepositorySpy);

  return { sut, findUserRepositorySpy, updateUserRepositorySpy };
};

const mockDTO = (): UpdateUserDTO => ({
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
});

describe('DbUpdateUser', () => {
  it('should call FindUserRepository with correct params', async () => {
    const id = faker.datatype.uuid();
    const { sut, findUserRepositorySpy } = makeSut();

    await sut.update(id, mockDTO());

    expect(findUserRepositorySpy.find).toHaveBeenCalledWith(id);
  });

  it('should throw if FindUserRepository returns null', async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    findUserRepositorySpy.find.mockResolvedValueOnce(null);

    const promise = sut.update(faker.datatype.uuid(), mockDTO());

    await expect(promise).rejects.toThrow(new Error('USER_NOT_FOUND'));
  });

  it('should call UpdateUserRepository with correct params', async () => {
    const id = faker.datatype.uuid();
    const params = mockDTO();
    const { sut, updateUserRepositorySpy } = makeSut();

    await sut.update(id, params);

    expect(updateUserRepositorySpy.update).toHaveBeenCalledWith(id, params);
  });

  it('should return the same as UpdateUserRepository', async () => {
    const { sut, updateUserRepositorySpy } = makeSut();

    const result = await sut.update(faker.datatype.uuid(), mockDTO());

    expect(result).toEqual(await getAsyncReturn(updateUserRepositorySpy.update));
  });
});
