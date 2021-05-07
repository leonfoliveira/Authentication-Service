import faker from 'faker';
import * as uuid from 'uuid';

import { UuidAdapter } from '@/infra/criptography';

jest.mock('uuid');

const makeSut = (): UuidAdapter => {
  jest.spyOn(uuid, 'v4').mockImplementation((): string => faker.datatype.uuid());
  const sut = new UuidAdapter();

  return sut;
};

describe('UuidAdapter', () => {
  describe('TokenGenerator', () => {
    it('should call uuid', () => {
      const sut = makeSut();

      sut.generate();

      expect(jest.spyOn(uuid, 'v4')).toHaveBeenCalled();
    });
  });
});
