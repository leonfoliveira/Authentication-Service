import { Request, Response } from 'express';

import { User } from '@/domain/models';
import env from '@/main/config/env';
import { Controller, HttpRequest } from '@/presentation/interfaces';

type ReturnType = (req: Request, res: Response) => Promise<void>;

export const adaptRoute = (controller: Controller): ReturnType => async (
  req: Request & { user?: User },
  res: Response,
): Promise<void> => {
  try {
    const request: HttpRequest<Record<string, any>> = {
      context: {
        user: req.user,
      },
      data: {
        ...req.params,
        ...req.headers,
        ...req.body,
        ...(req.cookies.refreshToken ? { refreshtoken: req.cookies.refreshToken } : {}),
      },
    };

    const httpResponse = await controller.handle(request);

    if (httpResponse.body?.refreshToken) {
      res.cookie('refreshToken', httpResponse.body?.refreshToken, {
        secure: env.nodeEnv !== 'development',
        httpOnly: true,
        domain: env.domain,
        maxAge: 1000 * env.refreshTokenExpiration,
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
