import faker from 'faker';

import { TypeormRefreshTokenRepository } from '@/infra/db';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';
import { MemoryDb } from '@/test/helpers';

const makeSut = (refreshTokenExpiration = 1000): TypeormRefreshTokenRepository =>
  new TypeormRefreshTokenRepository(refreshTokenExpiration);

describe('TypeormRefreshTokenRepository', () => {
  beforeAll(MemoryDb.connect);

  beforeEach(MemoryDb.clear);

  afterAll(MemoryDb.disconnect);

  const mockUser = async (): Promise<UserEntity> => {
    const user = new UserEntity();
    user.name = faker.name.firstName();
    user.surname = faker.name.lastName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.isAdmin = faker.datatype.boolean();
    user.emailConfirmToken = faker.datatype.uuid();
    user.passwordResetToken = faker.datatype.uuid();
    return user.save();
  };

  const mockRefreshToken = async (): Promise<RefreshTokensEntity> => {
    const refreshToken = new RefreshTokensEntity();
    refreshToken.token = faker.datatype.uuid();
    refreshToken.user = await mockUser();
    return refreshToken.save();
  };

  describe('CreateRefreshTokenRepository', () => {
    it('should create a RefreshTokenEntity', async () => {
      const sut = makeSut();
      const token = faker.datatype.uuid();
      const user = await mockUser();

      await sut.create(token, user.id);

      expect(await RefreshTokensEntity.findOne()).toBeTruthy();
    });
  });

  describe('FindUserByRefreshTokenRepository', () => {
    it('should find a UserEntity', async () => {
      const sut = makeSut();
      const { token } = await mockRefreshToken();
      const findOneSpy = jest.spyOn(RefreshTokensEntity, 'findOne');

      await sut.findUser(token);

      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('relations', ['user']);
      expect(findOneSpy.mock.calls[0][0]).toHaveProperty('where');
      expect((findOneSpy.mock.calls[0][0] as any).where).toHaveProperty('token');
      expect((findOneSpy.mock.calls[0][0] as any).where).toHaveProperty('issuedAt');
    });
  });

  describe('RevokeAllRefreshTokensByUserRepository', () => {
    it('should delete several RefreshTokenEntities', async () => {
      const sut = makeSut();
      const { user } = await mockRefreshToken();
      await mockRefreshToken();

      await sut.revokeAll(user.id);

      expect((await RefreshTokensEntity.find()).length).toBe(1);
    });
  });

  describe('RevokeRefreshTokenRepository', () => {
    it('should delete a RefreshTokenEntity', async () => {
      const sut = makeSut();
      const { token } = await mockRefreshToken();

      await sut.revoke(token);

      expect(await RefreshTokensEntity.findOne()).toBeFalsy();
    });
  });
});
