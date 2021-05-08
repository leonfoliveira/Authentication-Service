import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { FindUserByEmailRepository, HashComparer } from '@/application/interfaces';
import { DbSignin } from '@/application/usecases';
import { IncorrectPasswordException, UserNotFoundException } from '@/domain/errors';
import { GetAuthorization, SigninDTO } from '@/domain/usecases';
import { mockAuthorization, mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbSignin;
  findUserByEmailSpy: MockProxy<FindUserByEmailRepository>;
  hashComparerSpy: MockProxy<HashComparer>;
  getAuthorizationSpy: MockProxy<GetAuthorization>;
};

const makeSut = (): SutTypes => {
  const findUserByEmailSpy = mock<FindUserByEmailRepository>({
    findByEmail: jest.fn().mockResolvedValue(mockUser()),
  });
  const hashComparerSpy = mock<HashComparer>({
    compare: jest.fn().mockResolvedValue(true),
  });
  const getAuthorizationSpy = mock<GetAuthorization>({
    get: jest.fn().mockResolvedValue(mockAuthorization()),
  });
  const sut = new DbSignin(findUserByEmailSpy, hashComparerSpy, getAuthorizationSpy);

  return { sut, findUserByEmailSpy, hashComparerSpy, getAuthorizationSpy };
};

const mockDTO = (): SigninDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

describe('DbSignin', () => {
  it('should call FindUserByEmailRepository with correct params', async () => {
    const { sut, findUserByEmailSpy } = makeSut();
    const params = mockDTO();

    await sut.attempt(params);

    expect(findUserByEmailSpy.findByEmail).toHaveBeenCalledWith(params.email);
  });

  it('should throw if FindUserByEmailRepository returns null', async () => {
    const { sut, findUserByEmailSpy } = makeSut();
    findUserByEmailSpy.findByEmail.mockResolvedValueOnce(null);

    const promise = sut.attempt(mockDTO());

    await expect(promise).rejects.toThrow(new UserNotFoundException());
  });

  it('should call HashComparer with correct params', async () => {
    const { sut, findUserByEmailSpy, hashComparerSpy } = makeSut();
    const params = mockDTO();

    await sut.attempt(params);

    expect(hashComparerSpy.compare).toHaveBeenCalledWith(
      params.password,
      (await getAsyncReturn(findUserByEmailSpy.findByEmail)).password,
    );
  });

  it('should throw if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.compare.mockResolvedValueOnce(false);

    const promise = sut.attempt(mockDTO());

    await expect(promise).rejects.toThrow(new IncorrectPasswordException());
  });

  it('should call GetAuthorization with correct params', async () => {
    const { sut, findUserByEmailSpy, getAuthorizationSpy } = makeSut();

    await sut.attempt(mockDTO());

    expect(getAuthorizationSpy.get).toHaveBeenCalledWith(
      await getAsyncReturn(findUserByEmailSpy.findByEmail),
    );
  });

  it('should return the same as GetAuthorization', async () => {
    const { sut, getAuthorizationSpy } = makeSut();

    const result = await sut.attempt(mockDTO());

    expect(result).toEqual(await getAsyncReturn(getAuthorizationSpy.get));
  });
});
