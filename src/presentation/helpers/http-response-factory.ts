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
  makeUnauthorized: (): HttpResponse => ({
    statusCode: 401,
    body: {
      message: 'Email not found or incorrect password.',
    },
  }),
  makeConflict: (): HttpResponse => ({
    statusCode: 409,
    body: {
      message: 'Email is already in use.',
    },
  }),
};
