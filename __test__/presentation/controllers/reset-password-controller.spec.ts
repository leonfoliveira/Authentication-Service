import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { ResetPassword } from '@/domain/usecases';
import { ResetPasswordController, ResetPasswordRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';

type SutTypes = {
  sut: ResetPasswordController;
  resetPasswordSpy: MockProxy<ResetPassword>;
};

const makeSut = (): SutTypes => {
  const resetPasswordSpy = mock<ResetPassword>();
  const sut = new ResetPasswordController(resetPasswordSpy);

  return { sut, resetPasswordSpy };
};

const mockRequest = (): HttpRequest<ResetPasswordRequest> => ({
  context: {},
  data: {
    userId: faker.datatype.uuid(),
  },
});

describe('ResetPasswordController', () => {
  it('should call ResetPassword with correct params', async () => {
    const { sut, resetPasswordSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(resetPasswordSpy.reset).toHaveBeenCalledWith(request.data.userId);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({ statusCode: 204 });
  });

  it('should return 404 if ResetPassword throws UserNotFoundException', async () => {
    const { sut, resetPasswordSpy } = makeSut();
    resetPasswordSpy.reset.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });
});
