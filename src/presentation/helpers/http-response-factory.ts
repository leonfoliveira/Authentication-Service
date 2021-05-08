import { HttpResponse } from '@/presentation/interfaces';

export const HttpResponseFactory = {
  makeCreated: (body: any): HttpResponse => ({
    statusCode: 201,
    body,
  }),
  makeConflict: (): HttpResponse => ({
    statusCode: 409,
    body: {
      message: 'Email is already in use.',
    },
  }),
};
