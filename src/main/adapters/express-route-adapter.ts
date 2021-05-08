import { Request, Response } from 'express';

import env from '@/main/config/env';
import { Controller } from '@/presentation/interfaces';

type ReturnType = (req: Request, res: Response) => Promise<void>;

export const adaptRoute = (controller: Controller): ReturnType => async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const request: Record<string, any> = {
      ...req.params,
      ...req.headers,
      ...req.body,
      ...req.cookies,
    };

    const httpResponse = await controller.handle(request);

    if (httpResponse.body?.refreshToken) {
      res.cookie('refreshToken', httpResponse.body?.refreshToken, {
        secure: env.nodeEnv !== 'development',
        httpOnly: true,
        domain: env.domain,
        maxAge: 1000 * env.jwtRefreshTokenExpiration,
      });

      delete httpResponse.body.refreshToken;
    }

    res.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Authentication-Service: ', error);
    res.status(500).json({
      message: 'An unexpected error has occured. Please try again.',
    });
  }
};
