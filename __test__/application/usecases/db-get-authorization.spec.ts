import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  CreateRefreshTokenRepository,
  StatelessTokenGenerator,
  TokenGenerator,
} from '@/application/interfaces';
import { DbGetAuthorization } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';
import { getReturn } from '@/test/helpers';

type SutTypes = {
  sut: DbGetAuthorization;
  tokenGeneratorSpy: MockProxy<TokenGenerator>;
  statelessTokenGeneratorSpy: MockProxy<StatelessTokenGenerator>;
  createRefreshTokenRepositorySpy: MockProxy<CreateRefreshTokenRepository>;
};

const makeSut = (): SutTypes => {
  const tokenGeneratorSpy = mock<TokenGenerator>({
    generate: jest.fn().mockReturnValue(faker.datatype.uuid()),
  });
  const statelessTokenGeneratorSpy = mock<StatelessTokenGenerator>({
    generate: jest.fn().mockReturnValue(faker.datatype.uuid()),
  });
  const createRefreshTokenRepositorySpy = mock<CreateRefreshTokenRepository>();
  const sut = new DbGetAuthorization(
    tokenGeneratorSpy,
    statelessTokenGeneratorSpy,
    createRefreshTokenRepositorySpy,
  );

  return { sut, tokenGeneratorSpy, statelessTokenGeneratorSpy, createRefreshTokenRepositorySpy };
};

describe('DbGetAuthorization', () => {
  it('should call TokenGenerator with correct params', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();

    await sut.get(mockUser());

    expect(tokenGeneratorSpy.generate).toHaveBeenCalled();
  });

  it('should call StatelessTokenGenerator with correct params', async () => {
    const { sut, statelessTokenGeneratorSpy } = makeSut();
    const params = mockUser();

    await sut.get(params);

    expect(statelessTokenGeneratorSpy.generate).toHaveBeenCalledWith(params);
  });

  it('should call CreateRefreshTokenRepository with correct params', async () => {
    const { sut, tokenGeneratorSpy, createRefreshTokenRepositorySpy } = makeSut();

    await sut.get(mockUser());

    expect(createRefreshTokenRepositorySpy.create).toHaveBeenCalledWith(
      getReturn(tokenGeneratorSpy.generate),
    );
  });

  it('should return an AuthorizationModel', async () => {
    const { sut, tokenGeneratorSpy, statelessTokenGeneratorSpy } = makeSut();
    const params = mockUser();

    const result = await sut.get(params);

    expect(result).toEqual({
      accessToken: getReturn(statelessTokenGeneratorSpy.generate),
      refreshToken: getReturn(tokenGeneratorSpy.generate),
      user: params,
    });
  });
});
