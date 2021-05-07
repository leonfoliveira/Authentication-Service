import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  FindUserByEmailConfirmTokenRepository,
  UserConfirmEmailRepository,
} from '@/application/interfaces';
import { DbConfirmEmail } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbConfirmEmail;
  findUserByEmailConfirmTokenRepositorySpy: MockProxy<FindUserByEmailConfirmTokenRepository>;
  userConfirmEmailRepositorySpy: MockProxy<UserConfirmEmailRepository>;
};

const makeSut = (): SutTypes => {
  const findUserByEmailConfirmTokenRepositorySpy = mock<FindUserByEmailConfirmTokenRepository>({
    findByEmailConfirmToken: jest.fn().mockResolvedValue({ ...mockUser(), emailConfirmedAt: null }),
  });
  const userConfirmEmailRepositorySpy = mock<UserConfirmEmailRepository>();
  const sut = new DbConfirmEmail(
    findUserByEmailConfirmTokenRepositorySpy,
    userConfirmEmailRepositorySpy,
  );

  return { sut, findUserByEmailConfirmTokenRepositorySpy, userConfirmEmailRepositorySpy };
};

describe('DbConfirmEmail', () => {
  it('should call FindUserByEmailConfirmTokenRepository with correct params', async () => {
    const { sut, findUserByEmailConfirmTokenRepositorySpy } = makeSut();
    const params = faker.datatype.uuid();

    await sut.confirm(params);

    expect(findUserByEmailConfirmTokenRepositorySpy.findByEmailConfirmToken).toHaveBeenCalledWith(
      params,
    );
  });

  it('should throw if FindUserByEmailConfirmTokenRepository returns isEmailConfirmed true', async () => {
    const { sut, findUserByEmailConfirmTokenRepositorySpy } = makeSut();
    findUserByEmailConfirmTokenRepositorySpy.findByEmailConfirmToken.mockResolvedValueOnce({
      ...mockUser(),
      emailConfirmedAt: new Date(),
    });

    const promise = sut.confirm(faker.datatype.uuid());

    await expect(promise).rejects.toThrow(new Error('EMAIL_ALREADY_CONFIRMED'));
  });

  it('should throw if FindUserByEmailConfirmTokenRepository returns null', async () => {
    const { sut, findUserByEmailConfirmTokenRepositorySpy } = makeSut();
    findUserByEmailConfirmTokenRepositorySpy.findByEmailConfirmToken.mockResolvedValueOnce(null);

    const promise = sut.confirm(faker.datatype.uuid());

    await expect(promise).rejects.toThrow(new Error('USER_NOT_FOUND'));
  });

  it('should call UserConfirmEmailRepository with correct params', async () => {
    const {
      sut,
      findUserByEmailConfirmTokenRepositorySpy,
      userConfirmEmailRepositorySpy,
    } = makeSut();
    const params = faker.datatype.uuid();

    await sut.confirm(params);

    expect(userConfirmEmailRepositorySpy.confirmEmail).toHaveBeenCalledWith(
      (await getAsyncReturn(findUserByEmailConfirmTokenRepositorySpy.findByEmailConfirmToken)).id,
    );
  });
});
