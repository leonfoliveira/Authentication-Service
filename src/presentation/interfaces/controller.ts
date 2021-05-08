export interface Controller<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse<T>>;
}

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};
