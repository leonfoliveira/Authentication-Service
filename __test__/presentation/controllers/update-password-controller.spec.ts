import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserNotFoundException } from '@/domain/errors';
import { UpdatePassword } from '@/domain/usecases';
import { UpdatePasswordController, UpdatePasswordRequest } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/interfaces';

type SutTypes = {
  sut: UpdatePasswordController;
  updatePasswordSpy: MockProxy<UpdatePassword>;
};

const makeSut = (): SutTypes => {
  const updatePasswordSpy = mock<UpdatePassword>();
  const sut = new UpdatePasswordController(updatePasswordSpy);

  return { sut, updatePasswordSpy };
};

const mockRequest = (): HttpRequest<UpdatePasswordRequest> => ({
  context: {},
  data: {
    passwordResetToken: faker.datatype.uuid(),
    password: faker.internet.password(),
  },
});

describe('UpdatePasswordController', () => {
  it('should call UpdatePassword with correct params', async () => {
    const { sut, updatePasswordSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(updatePasswordSpy.update).toHaveBeenCalledWith(
      request.data.passwordResetToken,
      request.data.password,
    );
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual({
      statusCode: 204,
    });
  });

  it('should return 404 if UpdatePassword throws UserNotFoundException', async () => {
    const { sut, updatePasswordSpy } = makeSut();
    updatePasswordSpy.update.mockRejectedValueOnce(new UserNotFoundException());

    const response = await sut.handle(mockRequest());

    expect(response).toHaveProperty('statusCode', 404);
  });

  it('should throw if UpdatePassword throws any other exception', async () => {
    const { sut, updatePasswordSpy } = makeSut();
    updatePasswordSpy.update.mockRejectedValueOnce(new Error());

    const promise = sut.handle(mockRequest());

    await expect(promise).rejects.toThrow(new Error());
  });
});
