import faker from 'faker';
import MockDate from 'mockdate';

import { TypeormRefreshTokenRepository } from '@/infra/db';
import { RefreshTokensEntity, UserEntity } from '@/infra/entities';
import { MemoryDb } from '@/test/helpers';

const makeSut = (): TypeormRefreshTokenRepository => new TypeormRefreshTokenRepository();

describe('TypeormRefreshTokenRepository', () => {
  let user: UserEntity;

  beforeAll(async () => {
    await MemoryDb.connect();
    MockDate.set(new Date());
    user = new UserEntity();
    user.name = faker.name.firstName();
    user.surname = faker.name.lastName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.isAdmin = faker.datatype.boolean();
    user.emailConfirmToken = faker.datatype.uuid();
    user.passwordResetToken = faker.datatype.uuid();
    await user.save();
  });

  beforeEach(MemoryDb.clear);

  afterAll(async () => {
    await MemoryDb.disconnect();
    MockDate.reset();
  });

  describe('CreateRefreshTokenRepository', () => {
    it('should create a UserEntity', async () => {
      const sut = makeSut();
      const token = faker.datatype.uuid();

      const result = await sut.create(token, user.id);

      expect(result).toEqual(await RefreshTokensEntity.findOne());
    });
  });
});
