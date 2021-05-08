import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UpdatePassword } from '@/domain/usecases';
import { UpdatePasswordController, UpdatePasswordRequest } from '@/presentation/controllers';

type SutTypes = {
  sut: UpdatePasswordController;
  updatePasswordSpy: MockProxy<UpdatePassword>;
};

const makeSut = (): SutTypes => {
  const updatePasswordSpy = mock<UpdatePassword>();
  const sut = new UpdatePasswordController(updatePasswordSpy);

  return { sut, updatePasswordSpy };
};

const mockRequest = (): UpdatePasswordRequest => ({
  passwordResetToken: faker.datatype.uuid(),
  password: faker.internet.password(),
});

describe('UpdatePasswordController', () => {
  it('should call UpdatePassword with correct params', async () => {
    const { sut, updatePasswordSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(updatePasswordSpy.update).toHaveBeenCalledWith(
      request.passwordResetToken,
      request.password,
    );
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({
      statusCode: 204,
    });
  });

  it('should return 404 if UpdatePassword throws USER_NOT_FOUND', async () => {
    const { sut, updatePasswordSpy } = makeSut();
    updatePasswordSpy.update.mockRejectedValueOnce(new Error('USER_NOT_FOUND'));

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });
});
