import { HttpResponse } from '@/presentation/interfaces';

export const HttpResponseFactory = {
  makeOk: (body: any): HttpResponse => ({
    statusCode: 200,
    body,
  }),
  makeCreated: (body: any): HttpResponse => ({
    statusCode: 201,
    body,
  }),
  makeNoContent: (): HttpResponse => ({
    statusCode: 204,
  }),
  makeBadRequest: (message: string): HttpResponse => ({
    statusCode: 400,
    body: {
      message,
    },
  }),
  makeUnauthorized: (): HttpResponse => ({
    statusCode: 401,
    body: {
      message: 'Email not found or incorrect password.',
    },
  }),
  makeNotFound: (): HttpResponse => ({
    statusCode: 404,
    body: {
      message: 'User not found.',
    },
  }),
  makeConflict: (): HttpResponse => ({
    statusCode: 409,
    body: {
      message: 'Email is already in use.',
    },
  }),
};
