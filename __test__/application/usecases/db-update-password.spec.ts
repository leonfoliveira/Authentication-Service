import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  FindUserByPasswordResetTokenRepository,
  HashGenerator,
  RevokeAllRefreshTokensByUserRepository,
  UpdateUserRepository,
} from '@/application/interfaces';
import { DbUpdatePassword } from '@/application/usecases';
import { UserNotFoundException } from '@/domain/errors';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbUpdatePassword;
  findUserByPasswordResetTokenSpy: MockProxy<FindUserByPasswordResetTokenRepository>;
  hashGenerator: MockProxy<HashGenerator>;
  updateUserRepositorySpy: MockProxy<UpdateUserRepository>;
  revokeAllRefreshTokensByUserRepository: MockProxy<RevokeAllRefreshTokensByUserRepository>;
};

const makeSut = (): SutTypes => {
  const findUserByPasswordResetTokenSpy = mock<FindUserByPasswordResetTokenRepository>({
    findByPasswordResetToken: jest.fn().mockResolvedValue(mockUser()),
  });
  const hashGenerator = mock<HashGenerator>({
    generate: jest.fn().mockReturnValue(faker.datatype.uuid()),
  });
  const updateUserRepositorySpy = mock<UpdateUserRepository>();
  const revokeAllRefreshTokensByUserRepository = mock<RevokeAllRefreshTokensByUserRepository>();
  const sut = new DbUpdatePassword(
    findUserByPasswordResetTokenSpy,
    hashGenerator,
    updateUserRepositorySpy,
    revokeAllRefreshTokensByUserRepository,
  );

  return {
    sut,
    findUserByPasswordResetTokenSpy,
    hashGenerator,
    updateUserRepositorySpy,
    revokeAllRefreshTokensByUserRepository,
  };
};

describe('DbUpdatePassword', () => {
  it('should call FindUserByPasswordResetTokenRepository with correct params', async () => {
    const { sut, findUserByPasswordResetTokenSpy } = makeSut();
    const passwordResetToken = faker.datatype.uuid();

    await sut.update(passwordResetToken, faker.internet.password());

    expect(findUserByPasswordResetTokenSpy.findByPasswordResetToken).toHaveBeenCalledWith(
      passwordResetToken,
    );
  });

  it('should throw if FindUserByPasswordResetTokenRepository returns null', async () => {
    const { sut, findUserByPasswordResetTokenSpy } = makeSut();
    findUserByPasswordResetTokenSpy.findByPasswordResetToken.mockResolvedValueOnce(null);

    const promise = sut.update(faker.datatype.uuid(), faker.internet.password());

    await expect(promise).rejects.toThrow(new UserNotFoundException());
  });

  it('should call HashGenerator with correct params', async () => {
    const { sut, hashGenerator } = makeSut();
    const password = faker.internet.password();

    await sut.update(faker.datatype.uuid(), password);

    expect(hashGenerator.generate).toHaveBeenCalledWith(password);
  });

  it('should call UpdateUserRepository with correct params', async () => {
    const {
      sut,
      findUserByPasswordResetTokenSpy,
      hashGenerator,
      updateUserRepositorySpy,
    } = makeSut();
    const password = faker.internet.password();

    await sut.update(faker.datatype.uuid(), password);

    expect(updateUserRepositorySpy.update).toHaveBeenCalledWith(
      (await getAsyncReturn(findUserByPasswordResetTokenSpy.findByPasswordResetToken)).id,
      { password: await getAsyncReturn(hashGenerator.generate), passwordResetToken: null },
    );
  });

  it('should call RevokeAllRefreshTokensByUserRepository with correct params', async () => {
    const {
      sut,
      findUserByPasswordResetTokenSpy,
      revokeAllRefreshTokensByUserRepository,
    } = makeSut();

    await sut.update(faker.datatype.uuid(), faker.internet.password());

    expect(revokeAllRefreshTokensByUserRepository.revokeAll).toHaveBeenCalledWith(
      (await getAsyncReturn(findUserByPasswordResetTokenSpy.findByPasswordResetToken)).id,
    );
  });
});
