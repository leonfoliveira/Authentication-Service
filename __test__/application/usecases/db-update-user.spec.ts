import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  FindUserByEmailRepository,
  FindUserRepository,
  UpdateUserRepository,
} from '@/application/interfaces';
import { DbUpdateUser } from '@/application/usecases';
import { EmailInUseException, UserNotFoundException } from '@/domain/errors';
import { UpdateUserDTO } from '@/domain/usecases';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbUpdateUser;
  findUserRepositorySpy: MockProxy<FindUserRepository>;
  findUserByEmailRepositorySpy: MockProxy<FindUserByEmailRepository>;
  updateUserRepositorySpy: MockProxy<UpdateUserRepository>;
};

const makeSut = (email = faker.internet.email()): SutTypes => {
  const findUserRepositorySpy = mock<FindUserRepository>({
    find: jest.fn().mockResolvedValue({ ...mockUser(), email }),
  });
  const findUserByEmailRepositorySpy = mock<FindUserByEmailRepository>({
    findByEmail: jest.fn().mockResolvedValue(null),
  });
  const updateUserRepositorySpy = mock<UpdateUserRepository>();
  const sut = new DbUpdateUser(
    findUserRepositorySpy,
    findUserByEmailRepositorySpy,
    updateUserRepositorySpy,
  );

  return { sut, findUserRepositorySpy, findUserByEmailRepositorySpy, updateUserRepositorySpy };
};

const mockDTO = (): UpdateUserDTO => ({
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
});

describe('DbUpdateUser', () => {
  it('should call FindUserRepository with correct params', async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    const id = faker.datatype.uuid();

    await sut.update(id, mockDTO());

    expect(findUserRepositorySpy.find).toHaveBeenCalledWith(id);
  });

  it('should throw if FindUserRepository returns null', async () => {
    const { sut, findUserRepositorySpy } = makeSut();
    findUserRepositorySpy.find.mockResolvedValueOnce(null);

    const promise = sut.update(faker.datatype.uuid(), mockDTO());

    await expect(promise).rejects.toThrow(new UserNotFoundException());
  });

  it('should call FindUserByEmailRepository with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    const params = mockDTO();

    await sut.update(faker.datatype.uuid(), params);

    expect(findUserByEmailRepositorySpy.findByEmail).toHaveBeenCalledWith(params.email);
  });

  it('should not call FindUserByEmailRepository with if email param is provided', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    const id = faker.datatype.uuid();

    await sut.update(id, {});

    expect(findUserByEmailRepositorySpy.findByEmail).not.toHaveBeenCalled();
  });

  it('should not call FindUserByEmailRepository if the provided email is equals to FindUserRepository returned email', async () => {
    const email = faker.internet.email();
    const { sut, findUserByEmailRepositorySpy } = makeSut(email);

    await sut.update(faker.datatype.uuid(), { email });

    expect(findUserByEmailRepositorySpy.findByEmail).not.toHaveBeenCalled();
  });

  it('should throw if FindUserByEmailRepository returns some value', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    findUserByEmailRepositorySpy.findByEmail.mockResolvedValue(mockUser());

    const promise = sut.update(faker.datatype.uuid(), mockDTO());

    await expect(promise).rejects.toThrow(new EmailInUseException());
  });

  it('should call UpdateUserRepository with correct params', async () => {
    const { sut, updateUserRepositorySpy } = makeSut();
    const id = faker.datatype.uuid();
    const params = mockDTO();

    await sut.update(id, params);

    expect(updateUserRepositorySpy.update).toHaveBeenCalledWith(id, params);
  });

  it('should return the same as UpdateUserRepository', async () => {
    const { sut, updateUserRepositorySpy } = makeSut();

    const result = await sut.update(faker.datatype.uuid(), mockDTO());

    expect(result).toEqual(await getAsyncReturn(updateUserRepositorySpy.update));
  });
});
