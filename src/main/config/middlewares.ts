import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

export default (app: Express): void => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
};
