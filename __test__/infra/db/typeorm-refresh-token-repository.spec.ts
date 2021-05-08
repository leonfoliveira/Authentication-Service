import faker from 'faker';

import { TypeormRefreshTokenRepository } from '@/infra/db';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';
import { MemoryDb } from '@/test/helpers';

const makeSut = (): TypeormRefreshTokenRepository => new TypeormRefreshTokenRepository();

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
    it('should create a UserEntity', async () => {
      const sut = makeSut();
      const token = faker.datatype.uuid();
      const user = await mockUser();

      const result = await sut.create(token, user.id);
      expect(result).toEqual(await RefreshTokensEntity.findOne({ relations: ['user'] }));
    });
  });

  describe('FindUserByRefreshTokenRepository', () => {
    it('should find a UserEntity', async () => {
      const sut = makeSut();
      const { token } = await mockRefreshToken();

      const result = await sut.findUser(token);

      expect(result).toEqual((await RefreshTokensEntity.findOne({ relations: ['user'] })).user);
    });
  });

  describe('RevokeAllRefreshTokensByUserRepository', () => {
    it('should several RefreshTokenEntities', async () => {
      const sut = makeSut();
      const { user } = await mockRefreshToken();
      await mockRefreshToken();

      await sut.revokeAll(user.id);

      expect((await RefreshTokensEntity.find()).length).toBe(1);
    });
  });
});
