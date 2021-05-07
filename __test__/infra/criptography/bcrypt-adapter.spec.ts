import bcrypt from 'bcrypt';
import faker from 'faker';

import { BcryptAdapter } from '@/infra/criptography';
import { getAsyncReturn } from '@/test/helpers';

jest.mock('bcrypt');

const makeSut = (rounds = faker.datatype.number()): BcryptAdapter => {
  jest.spyOn(bcrypt, 'hash').mockClear().mockResolvedValue(faker.datatype.uuid());
  const sut = new BcryptAdapter(rounds);

  return sut;
};

describe('BcryptAdapter', () => {
  describe('HashGenerator', () => {
    it('should call bcrypt.hash with correct params', async () => {
      const rounds = faker.datatype.number();
      const sut = makeSut(rounds);
      const param = faker.random.word();

      await sut.generate(param);

      expect(bcrypt.hash).toHaveBeenCalledWith(param, rounds);
    });

    it('should return the same as bcrypt.hash', async () => {
      const sut = makeSut();

      const result = await sut.generate(faker.random.word());
      expect(result).toBe(await getAsyncReturn(jest.spyOn(bcrypt, 'hash')));
    });
  });

  describe('HashComparer', () => {
    it('should call bcrypt.compare with correct params', async () => {
      const sut = makeSut();
      const value = faker.random.word();
      const hash = faker.datatype.uuid();

      await sut.compare(value, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(value, hash);
    });

    it('should return the same as bcrypt.compare', async () => {
      const sut = makeSut();

      const result = await sut.compare(faker.random.word(), faker.datatype.uuid());
      expect(result).toBe(await getAsyncReturn(jest.spyOn(bcrypt, 'compare')));
    });
  });
});
