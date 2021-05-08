import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  FindUserByRefreshTokenRepository,
  RevokeRefreshTokenRepository,
} from '@/application/interfaces';
import { DbRefreshAuthorization } from '@/application/usecases';
import { UserNotFoundException } from '@/domain/errors';
import { GetAuthorization } from '@/domain/usecases';
import { mockAuthorization, mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbRefreshAuthorization;
  findUserByRefreshTokenRepositorySpy: MockProxy<FindUserByRefreshTokenRepository>;
  revokeRefreshTokenRepositorySpy: MockProxy<RevokeRefreshTokenRepository>;
  getAuthorizationSpy: GetAuthorization;
};

const makeSut = (): SutTypes => {
  const findUserByRefreshTokenRepositorySpy = mock<FindUserByRefreshTokenRepository>({
    findUser: jest.fn().mockResolvedValue(mockUser()),
  });
  const revokeRefreshTokenRepositorySpy = mock<RevokeRefreshTokenRepository>();
  const getAuthorizationSpy = mock<GetAuthorization>({
    get: jest.fn().mockResolvedValue(mockAuthorization()),
  });
  const sut = new DbRefreshAuthorization(
    findUserByRefreshTokenRepositorySpy,
    revokeRefreshTokenRepositorySpy,
    getAuthorizationSpy,
  );

  return {
    sut,
    findUserByRefreshTokenRepositorySpy,
    revokeRefreshTokenRepositorySpy,
    getAuthorizationSpy,
  };
};

const mockDTO = (): string => faker.datatype.uuid();

describe('DbRefreshAuthorization', () => {
  it('should call FindUserByRefreshTokenRepository with correct params', async () => {
    const { sut, findUserByRefreshTokenRepositorySpy } = makeSut();
    const params = mockDTO();

    await sut.refresh(params);

    expect(findUserByRefreshTokenRepositorySpy.findUser).toHaveBeenCalledWith(params);
  });

  it('should throw if FindUserByRefreshTokenRepository returns null', async () => {
    const { sut, findUserByRefreshTokenRepositorySpy } = makeSut();
    findUserByRefreshTokenRepositorySpy.findUser.mockResolvedValueOnce(null);

    const promise = sut.refresh(mockDTO());

    await expect(promise).rejects.toThrow(new UserNotFoundException());
  });

  it('should call RevokeRefreshTokenRepository with correct params', async () => {
    const { sut, revokeRefreshTokenRepositorySpy } = makeSut();
    const params = mockDTO();

    await sut.refresh(params);

    expect(revokeRefreshTokenRepositorySpy.revoke).toHaveBeenCalledWith(params);
  });

  it('should call GetAuthorization with correct params', async () => {
    const { sut, findUserByRefreshTokenRepositorySpy, getAuthorizationSpy } = makeSut();

    await sut.refresh(mockDTO());

    expect(getAuthorizationSpy.get).toHaveBeenCalledWith(
      await getAsyncReturn(findUserByRefreshTokenRepositorySpy.findUser),
    );
  });

  it('should return the same as GetAuthorization', async () => {
    const { sut, getAuthorizationSpy } = makeSut();

    const result = await sut.refresh(mockDTO());

    expect(result).toEqual(await getAsyncReturn(getAuthorizationSpy.get));
  });
});
