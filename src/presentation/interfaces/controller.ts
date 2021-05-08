export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse<T>>;
}

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};
