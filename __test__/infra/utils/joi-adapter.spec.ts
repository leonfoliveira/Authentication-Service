import faker from 'faker';
import Joi, { ValidationError } from 'joi';

import { JoiAdapter } from '@/infra/utils';

type SutTypes = {
  sut: JoiAdapter;
  validateSpy: jest.SpyInstance<
    Joi.ValidationResult,
    [value: any, options?: Joi.ValidationOptions]
  >;
};

const makeSut = (): SutTypes => {
  const schema = Joi.object({
    [faker.database.column()]: Joi.string(),
  });
  const validateSpy = jest.spyOn(schema, 'validate').mockReturnValue({
    value: {
      [faker.database.column()]: faker.random.words(),
    },
    error: undefined,
  });
  const sut = new JoiAdapter(schema);

  return { sut, validateSpy };
};

const mockData = (): Record<string, string> => ({
  [faker.database.column()]: faker.random.words(),
});

describe('JoiAdapter', () => {
  it('should call joi.validate with correct values', () => {
    const { sut, validateSpy } = makeSut();
    const data = mockData();

    sut.validate(data);

    expect(validateSpy).toHaveBeenCalledWith(data, { stripUnknown: true });
  });

  it('should return sanitized data on success', () => {
    const { sut, validateSpy } = makeSut();

    const result = sut.validate(mockData());

    expect(result).toEqual({
      sanitizedData: validateSpy.mock.results[0].value.value,
      error: null,
    });
  });

  it('should return an Error if joi.validate returns an error', () => {
    const { sut, validateSpy } = makeSut();
    const error = new ValidationError(faker.random.words(), null, null);
    validateSpy.mockReturnValueOnce({ value: {}, error });

    const result = sut.validate(mockData());

    expect(result).toEqual({
      sanitizedData: {},
      error: new Error(error.message),
    });
  });
});
