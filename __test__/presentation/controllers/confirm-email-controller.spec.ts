import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { ConfirmEmail } from '@/domain/usecases';
import { ConfirmEmailController, ConfirmEmailRequest } from '@/presentation/controllers';

type SutTypes = {
  sut: ConfirmEmailController;
  confirmEmailSpy: MockProxy<ConfirmEmail>;
};

const makeSut = (): SutTypes => {
  const confirmEmailSpy = mock<ConfirmEmail>();
  const sut = new ConfirmEmailController(confirmEmailSpy);

  return { sut, confirmEmailSpy };
};

const mockRequest = (): ConfirmEmailRequest => ({
  emailConfirmToken: faker.datatype.uuid(),
});

describe('ConfirmEmailController', () => {
  it('should call ConfirmEmail with correct params', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(confirmEmailSpy.confirm).toHaveBeenCalledWith(request.emailConfirmToken);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 204 });
  });

  it('should return 404 if ConfirmEmail throws USER_NOT_FOUND', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    confirmEmailSpy.confirm.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 404, body: { message: 'User not found.' } });
  });

  it('should return 400 if ConfirmEmail throws EMAIL_ALREADY_CONFIRMED', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    confirmEmailSpy.confirm.mockRejectedValueOnce(new Error('EMAIL_ALREADY_CONFIRMED'));

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 400, body: { message: 'Email is already confirmed.' } });
  });
});
