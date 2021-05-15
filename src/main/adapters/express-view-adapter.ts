import path from 'path';

import { Request, Response } from 'express';

type ReturnType = (req: Request, res: Response) => Promise<void>;

export const adaptView = (view: string): ReturnType => async (
  req: Request,
  res: Response,
): Promise<void> => {
  const options: Record<string, any> = {
    ...req.params,
    ...req.headers,
    ...req.body,
  };

  res.render(path.resolve(__dirname, '../../presentation/views/', view), options);
};
