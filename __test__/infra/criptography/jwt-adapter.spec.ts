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
  jest
    .spyOn(jwt, 'verify')
    .mockClear()
    .mockImplementation(
      (): Record<string, any> => ({ [faker.database.column()]: faker.random.word() }),
    );
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

  describe('StatelessTokenDecoder', () => {
    it('should call jwt.verify with correct params', () => {
      const secret = faker.random.word();
      const sut = makeSut(secret);
      const statelessToken = faker.datatype.uuid();

      sut.decode(statelessToken);

      expect(jwt.verify).toHaveBeenCalledWith(statelessToken, secret);
    });

    it('should return the same as jwt.verify', () => {
      const sut = makeSut();

      const result = sut.decode(faker.datatype.uuid());

      expect(result).toBe(getReturn(jest.spyOn(jwt, 'verify')));
    });

    it('should return null if jwt.verify throws', () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(
        (): Record<string, any> => {
          throw new Error();
        },
      );

      const result = sut.decode(faker.datatype.uuid());

      expect(result).toBe(null);
    });
  });
});
