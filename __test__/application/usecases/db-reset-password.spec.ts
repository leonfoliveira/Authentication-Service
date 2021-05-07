import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { FindUserRepository, TokenGenerator, UpdateUserRepository } from '@/application/interfaces';
import { DbResetPassword } from '@/application/usecases';
import { SendPasswordResetEmail } from '@/domain/usecases';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn, getReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbResetPassword;
  findUserRepository: MockProxy<FindUserRepository>;
  tokenGenerator: MockProxy<TokenGenerator>;
  updateUserRepositorySpy: MockProxy<UpdateUserRepository>;
  sendPasswordResetEmailSpy: MockProxy<SendPasswordResetEmail>;
};

const makeSut = (): SutTypes => {
  const findUserRepository = mock<FindUserRepository>({
    find: jest.fn().mockResolvedValue(mockUser()),
  });
  const tokenGenerator = mock<TokenGenerator>({
    generate: jest.fn().mockReturnValue(faker.datatype.uuid()),
  });
  const updateUserRepositorySpy = mock<UpdateUserRepository>();
  const sendPasswordResetEmailSpy = mock<SendPasswordResetEmail>();
  const sut = new DbResetPassword(
    findUserRepository,
    tokenGenerator,
    updateUserRepositorySpy,
    sendPasswordResetEmailSpy,
  );

  return {
    sut,
    findUserRepository,
    tokenGenerator,
    updateUserRepositorySpy,
    sendPasswordResetEmailSpy,
  };
};

const mockDTO = faker.datatype.uuid;

describe('DbResetPassword', () => {
  it('should call FindUserRepository with correct params', async () => {
    const { sut, findUserRepository } = makeSut();
    const id = mockDTO();

    await sut.reset(id);

    expect(findUserRepository.find).toHaveBeenCalledWith(id);
  });

  it('should throw if FindUserRepository returns null', async () => {
    const { sut, findUserRepository } = makeSut();
    findUserRepository.find.mockResolvedValueOnce(null);

    const promise = sut.reset(mockDTO());

    await expect(promise).rejects.toThrow(new Error('USER_NOT_FOUND'));
  });

  it('should call TokenGenerator with correct params', async () => {
    const { sut, tokenGenerator } = makeSut();

    await sut.reset(mockDTO());

    expect(tokenGenerator.generate).toHaveBeenCalled();
  });

  it('should call UpdateUserRepository with correct params', async () => {
    const { sut, tokenGenerator, updateUserRepositorySpy } = makeSut();
    const id = mockDTO();

    await sut.reset(id);

    expect(updateUserRepositorySpy.update).toHaveBeenCalledWith(id, {
      passwordResetToken: getReturn(tokenGenerator.generate),
    });
  });

  it('should call SendPasswordResetEmail with correct params', async () => {
    const { sut, findUserRepository, sendPasswordResetEmailSpy } = makeSut();

    await sut.reset(mockDTO());

    expect(sendPasswordResetEmailSpy.send).toHaveBeenCalledWith(
      await getAsyncReturn(findUserRepository.find),
    );
  });
});
