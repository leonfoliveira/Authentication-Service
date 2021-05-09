import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { DecodeAccessToken } from '@/domain/usecases';
import { HttpRequest } from '@/presentation/interfaces';
import { AuthMiddleware, AuthRequest } from '@/presentation/middlewares';
import { mockUser } from '@/test/domain/models';
import { getReturn } from '@/test/helpers';

type SutTypes = {
  sut: AuthMiddleware;
  decodeAccessTokenSpy: MockProxy<DecodeAccessToken>;
};

const makeSut = (isAdminRequired = false): SutTypes => {
  const decodeAccessTokenSpy = mock<DecodeAccessToken>({
    decode: jest.fn().mockReturnValue(mockUser()),
  });
  const sut = new AuthMiddleware(decodeAccessTokenSpy, isAdminRequired);

  return { sut, decodeAccessTokenSpy };
};

const mockRequest = (accessToken = faker.datatype.uuid()): HttpRequest<AuthRequest> => ({
  context: {},
  data: {
    authorization: `Bearer ${accessToken}`,
  },
});

describe('AuthMiddleware', () => {
  it('should return 401 if no authorization is provided', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({ context: {}, data: {} });

    expect(result).toHaveProperty('statusCode', 401);
  });

  it('should return 401 if authorization is not in Bearer format', async () => {
    const { sut } = makeSut();

    const result = await sut.handle({
      context: {},
      data: { authorization: faker.datatype.uuid() },
    });

    expect(result).toHaveProperty('statusCode', 401);
  });

  it('should call DecodeAccessToken with correct params', async () => {
    const { sut, decodeAccessTokenSpy } = makeSut();
    const accessToken = faker.datatype.uuid();
    const request = mockRequest(accessToken);

    await sut.handle(request);

    expect(decodeAccessTokenSpy.decode).toHaveBeenCalledWith(accessToken);
  });

  it('should return 401 if DecodeAccessToken return null', async () => {
    const { sut, decodeAccessTokenSpy } = makeSut();
    decodeAccessTokenSpy.decode.mockReturnValue(null);

    const result = await sut.handle(mockRequest());

    expect(result).toHaveProperty('statusCode', 401);
  });

  it('should return 401 if DecodeAccessToken return a non admin user and admin is required', async () => {
    const { sut, decodeAccessTokenSpy } = makeSut(true);
    decodeAccessTokenSpy.decode.mockReturnValue({ ...mockUser(), isAdmin: false });

    const result = await sut.handle(mockRequest());

    expect(result).toHaveProperty('statusCode', 401);
  });

  it('should return 200 with DecodeAccessToken return', async () => {
    const { sut, decodeAccessTokenSpy } = makeSut();

    const result = await sut.handle(mockRequest());

    expect(result).toEqual({ statusCode: 200, body: getReturn(decodeAccessTokenSpy.decode) });
  });
});
