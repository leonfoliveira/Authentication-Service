import faker from 'faker';
import MockDate from 'mockdate';

import { CreateUserRepositoryDTO, UpdateUserRepositoryDTO } from '@/application/interfaces';
import { TypeormUserRepository } from '@/infra/db';
import { UserEntity } from '@/infra/entities';
import { MemoryDb } from '@/test/helpers';

const makeSut = (): TypeormUserRepository => new TypeormUserRepository();

describe('TypeormUserRepository', () => {
  beforeAll(async () => {
    await MemoryDb.connect();
    MockDate.set(new Date());
  });

  beforeEach(MemoryDb.clear);

  afterAll(async () => {
    await MemoryDb.disconnect();
    MockDate.reset();
  });

  const mockUser = (): Promise<UserEntity> => {
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

  describe('CreateUserRepository', () => {
    const mockDTO = (): CreateUserRepositoryDTO => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      emailConfirmToken: faker.datatype.uuid(),
    });

    it('should create a UserEntity', async () => {
      const sut = makeSut();
      const params = mockDTO();

      const result = await sut.create(params);

      expect(result).toEqual(await UserEntity.findOne());
    });
  });

  describe('DeleteUserRepository', () => {
    it('should delete a UserEntity', async () => {
      const { id } = await mockUser();
      const sut = makeSut();

      await sut.delete(id);

      expect(await UserEntity.findOne()).toBeFalsy();
    });
  });

  describe('FindUserByEmailConfirmTokenRepository', () => {
    it('should return a UserEntity', async () => {
      const { emailConfirmToken } = await mockUser();
      const sut = makeSut();

      const result = await sut.findByEmailConfirmToken(emailConfirmToken);

      expect(result).toEqual(await UserEntity.findOne());
    });
  });

  describe('FindUserByEmailRepository', () => {
    it('should return a UserEntity', async () => {
      const { email } = await mockUser();
      const sut = makeSut();

      const result = await sut.findByEmail(email);

      expect(result).toEqual(await UserEntity.findOne());
    });
  });

  describe('FindUserByPasswordResetTokenRepository', () => {
    it('should return a UserEntity', async () => {
      const { passwordResetToken } = await mockUser();
      const sut = makeSut();

      const result = await sut.findByPasswordResetToken(passwordResetToken);

      expect(result).toEqual(await UserEntity.findOne());
    });
  });

  describe('FindUserRepository', () => {
    it('should return a UserEntity', async () => {
      const { id } = await mockUser();
      const sut = makeSut();

      const result = await sut.find(id);

      expect(result).toEqual(await UserEntity.findOne());
    });

    it('should return a null if no UserEntity is found', async () => {
      const sut = makeSut();

      const result = await sut.find(faker.datatype.uuid());

      expect(result).toBeNull();
    });
  });

  describe('UpdateUserRepository', () => {
    const mockDTO = (): UpdateUserRepositoryDTO => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      passwordResetToken: faker.datatype.uuid(),
    });

    it('should update a UserEntity', async () => {
      const { id } = await mockUser();
      const sut = makeSut();
      const params = mockDTO();

      const result = await sut.update(id, params);

      expect(result).toEqual(await UserEntity.findOne());
      expect(result.name).toBe(params.name);
    });

    it('should update a UserEntity without some param', async () => {
      const { id, name } = await mockUser();
      const sut = makeSut();

      const result = await sut.update(id, {});

      expect(result).toEqual(await UserEntity.findOne());
      expect(result.name).toBe(name);
    });
  });

  describe('UserConfirmEmailRepository', () => {
    it('should update a UserEntity emailConfirmedAt', async () => {
      const { id } = await mockUser();
      const sut = makeSut();

      await sut.confirmEmail(id);

      expect((await UserEntity.findOne()).emailConfirmedAt).toEqual(new Date().toString());
    });
  });

  describe('UserGrantAdminRepository', () => {
    it('should update a UserEntity isAdmin', async () => {
      const { id } = await mockUser();
      const sut = makeSut();

      await sut.grant(id);

      expect((await UserEntity.findOne()).isAdmin).toEqual(true);
    });
  });
});
