import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  CreateUserRepository,
  FindUserByEmailRepository,
  HashGenerator,
  TokenGenerator,
} from '@/application/interfaces';
import { DbSignup } from '@/application/usecases';
import { SendConfirmationEmail, SignupDTO } from '@/domain/usecases';
import { mockUser } from '@/test/domain/models';
import { getAsyncReturn, getReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbSignup;
  findUserByEmailRepositorySpy: MockProxy<FindUserByEmailRepository>;
  hashGeneratorSpy: MockProxy<HashGenerator>;
  tokenGeneratorSpy: MockProxy<TokenGenerator>;
  createUserRepositorySpy: MockProxy<CreateUserRepository>;
  sendConfirmationEmail: MockProxy<SendConfirmationEmail>;
};

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = mock<FindUserByEmailRepository>({
    findByEmail: jest.fn().mockResolvedValue(null),
  });
  const hashGeneratorSpy = mock<HashGenerator>({
    generate: jest.fn().mockResolvedValue(faker.datatype.uuid()),
  });
  const tokenGeneratorSpy = mock<TokenGenerator>({
    generate: jest.fn().mockReturnValue(faker.datatype.uuid()),
  });
  const createUserRepositorySpy = mock<CreateUserRepository>({
    create: jest.fn().mockResolvedValueOnce(mockUser()),
  });
  const sendConfirmationEmail = mock<SendConfirmationEmail>();
  const sut = new DbSignup(
    findUserByEmailRepositorySpy,
    hashGeneratorSpy,
    tokenGeneratorSpy,
    createUserRepositorySpy,
    sendConfirmationEmail,
  );

  return {
    sut,
    findUserByEmailRepositorySpy,
    hashGeneratorSpy,
    tokenGeneratorSpy,
    createUserRepositorySpy,
    sendConfirmationEmail,
  };
};

const mockDTO = (): SignupDTO => ({
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

describe('DbSignup', () => {
  it('should call FindUserByEmailRepository with correct params', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    const params = mockDTO();

    await sut.attempt(params);

    expect(findUserByEmailRepositorySpy.findByEmail).toHaveBeenCalledWith(params.email);
  });

  it('should throw if FindUserByEmailRepository returns some value', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut();
    findUserByEmailRepositorySpy.findByEmail.mockResolvedValueOnce(mockUser());

    const promise = sut.attempt(mockDTO());

    await expect(promise).rejects.toThrow(new Error('EMAIL_IN_USE'));
  });

  it('should call HashGenerator with correct params', async () => {
    const { sut, hashGeneratorSpy } = makeSut();
    const params = mockDTO();

    await sut.attempt(params);

    expect(hashGeneratorSpy.generate).toHaveBeenCalledWith(params.password);
  });

  it('should call TokenGenerator with correct params', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();

    await sut.attempt(mockDTO());

    expect(tokenGeneratorSpy.generate).toHaveBeenCalled();
  });

  it('should call CreateUserRepository with correct params', async () => {
    const { sut, hashGeneratorSpy, tokenGeneratorSpy, createUserRepositorySpy } = makeSut();
    const params = mockDTO();

    await sut.attempt(params);

    expect(createUserRepositorySpy.create).toHaveBeenCalledWith({
      ...params,
      password: await getAsyncReturn(hashGeneratorSpy.generate),
      emailConfirmToken: getReturn(tokenGeneratorSpy.generate),
    });
  });

  it('should call SendConfirmationEmail with correct params', async () => {
    const { sut, createUserRepositorySpy, sendConfirmationEmail } = makeSut();

    await sut.attempt(mockDTO());

    expect(sendConfirmationEmail.send).toHaveBeenCalledWith(
      await getAsyncReturn(createUserRepositorySpy.create),
    );
  });

  it('should return the CreateUserRepository result', async () => {
    const { sut, createUserRepositorySpy } = makeSut();

    const result = await sut.attempt(mockDTO());

    expect(result).toEqual(await getAsyncReturn(createUserRepositorySpy.create));
  });
});
