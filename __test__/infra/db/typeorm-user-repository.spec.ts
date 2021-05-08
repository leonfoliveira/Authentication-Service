import faker from 'faker';

import { CreateUserRepositoryDTO } from '@/application/interfaces';
import { TypeormUserRepository } from '@/infra/db';
import { UserEntity } from '@/infra/entities';
import { MemoryDb } from '@/test/helpers';

const makeSut = (): TypeormUserRepository => new TypeormUserRepository();

describe('TypeormUserRepository', () => {
  beforeAll(MemoryDb.connect);
  beforeEach(MemoryDb.clear);
  afterAll(MemoryDb.disconnect);

  const mockUser = (): Promise<UserEntity> => {
    const user = new UserEntity();
    user.name = faker.name.firstName();
    user.surname = faker.name.lastName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.isAdmin = faker.datatype.boolean();
    user.emailConfirmToken = faker.datatype.uuid();
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
});
