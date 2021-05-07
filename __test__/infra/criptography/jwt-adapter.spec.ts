import faker from 'faker';
import jwt from 'jsonwebtoken';

import { JwtAdapter } from '@/infra/criptography';
import { getReturn } from '@/test/helpers';

jest.mock('jsonwebtoken');

const makeSut = (secret = faker.random.word()): JwtAdapter => {
  jest
    .spyOn(jwt, 'sign')
    .mockClear()
    .mockImplementation((): string => faker.datatype.uuid());
  const sut = new JwtAdapter(secret);

  return sut;
};

const mockDTO = (): Record<string, any> => ({
  [faker.database.column()]: faker.random.word(),
});

describe('JwtAdapter', () => {
  describe('StatelessTokenGenerator', () => {
    it('should call jwt.sign with correct params', () => {
      const secret = faker.random.word();
      const sut = makeSut(secret);
      const params = mockDTO();

      sut.generate(params);

      expect(jwt.sign).toHaveBeenCalledWith(params, secret);
    });

    it('should return the same as jwt.sign', () => {
      const sut = makeSut();

      const result = sut.generate(mockDTO());
      expect(result).toBe(getReturn(jest.spyOn(jwt, 'sign')));
    });
  });
});
