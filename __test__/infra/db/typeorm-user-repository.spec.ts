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
});
