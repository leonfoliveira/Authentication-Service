import { NextFunction, Request, Response } from 'express';

import { Controller } from '@/presentation/interfaces';

type ReturnType = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const adaptMiddleware = (middleware: Controller): ReturnType => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request: Record<string, any> = {
      ...req.params,
      ...req.headers,
      ...req.body,
      ...req.cookies,
    };

    const httpResponse = await middleware.handle(request);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      next();
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Authentication-Service: ', error);
    res.status(500).json({
      message: 'An unexpected error has occured. Please try again.',
    });
  }
};