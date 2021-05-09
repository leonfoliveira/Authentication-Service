import { User } from '@/domain/models';

export interface Controller<T = any> {
  handle: (request: HttpRequest<T>) => Promise<HttpResponse>;
}

export type HttpRequest<T = any> = {
  context: {
    user?: User;
  };
  data?: T;
};

export type HttpResponse = {
  statusCode: number;
  body?: any;
};
