import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { ResetPassword } from '@/domain/usecases';
import { ResetPasswordController, ResetPasswordRequest } from '@/presentation/controllers';

type SutTypes = {
  sut: ResetPasswordController;
  resetPasswordSpy: MockProxy<ResetPassword>;
};

const makeSut = (): SutTypes => {
  const resetPasswordSpy = mock<ResetPassword>();
  const sut = new ResetPasswordController(resetPasswordSpy);

  return { sut, resetPasswordSpy };
};

const mockRequest = (): ResetPasswordRequest => ({
  userId: faker.datatype.uuid(),
});

describe('ResetPasswordController', () => {
  it('should call ResetPassword with correct params', async () => {
    const { sut, resetPasswordSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(resetPasswordSpy.reset).toHaveBeenCalledWith(request.userId);
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({ statusCode: 204 });
  });

  it('should return 404 if ResetPassword throws USER_NOT_FOUND', async () => {
    const { sut, resetPasswordSpy } = makeSut();
    resetPasswordSpy.reset.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });
});