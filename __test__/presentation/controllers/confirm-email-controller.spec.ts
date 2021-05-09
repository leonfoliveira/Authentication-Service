import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { EmailAlreadyConfirmedException, UserNotFoundException } from '@/domain/errors';
import { ConfirmEmail } from '@/domain/usecases';
import { ConfirmEmailController, ConfirmEmailRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';

type SutTypes = {
  sut: ConfirmEmailController;
  confirmEmailSpy: MockProxy<ConfirmEmail>;
};

const makeSut = (): SutTypes => {
  const confirmEmailSpy = mock<ConfirmEmail>();
  const sut = new ConfirmEmailController(confirmEmailSpy);

  return { sut, confirmEmailSpy };
};

const mockRequest = (): HttpRequest<ConfirmEmailRequest> => ({
  context: {},
  data: {
    emailConfirmToken: faker.datatype.uuid(),
  },
});

describe('ConfirmEmailController', () => {
  it('should call ConfirmEmail with correct params', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(confirmEmailSpy.confirm).toHaveBeenCalledWith(request.data.emailConfirmToken);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 204 });
  });

  it('should return 404 if ConfirmEmail throws UserNotFoundException', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    confirmEmailSpy.confirm.mockRejectedValueOnce(new UserNotFoundException());

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 404, body: { message: 'User not found.' } });
  });

  it('should return 400 if ConfirmEmail throws EmailAlreadyConfirmedException', async () => {
    const { sut, confirmEmailSpy } = makeSut();
    confirmEmailSpy.confirm.mockRejectedValueOnce(new EmailAlreadyConfirmedException());

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 400, body: { message: 'Email is already confirmed.' } });
  });
});
