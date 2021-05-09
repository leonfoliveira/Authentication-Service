import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

export default (app: Express): void => {
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static('public'));
};
