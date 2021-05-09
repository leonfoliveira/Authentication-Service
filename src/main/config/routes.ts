import express, { Express } from 'express';

import { adaptMiddleware, adaptRoute, adaptView } from '@/main/adapters';
import {
  makeConfirmEmailController,
  makeDeleteUserController,
  makeGrantAdminController,
  makeRefreshAuthorizationController,
  makeResetPasswordController,
  makeSigninController,
  makeSignupController,
  makeUpdatePasswordController,
  makeUpdateUserController,
} from '@/main/factories/controllers';
import { makeAuthMiddleware } from '@/main/factories/middlewares';

export default (app: Express): void => {
  const router = express.Router();
  app.use('/api', router);

  app.set('view engine', 'ejs');
  app.get('/confirm/:emailConfirmToken', adaptView('confirm-email.ejs'));
  app.get('/password/:passwordResetToken', adaptView('password-update.ejs'));

  router.post('/signup', adaptRoute(makeSignupController()));
  router.get('/confirm/:emailConfirmToken', adaptRoute(makeConfirmEmailController()));
  router.post('/signin', adaptRoute(makeSigninController()));

  router.post(
    '/refresh',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeRefreshAuthorizationController()),
  );
  router.put(
    '/user',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeUpdateUserController()),
  );
  router.post(
    '/reset',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeResetPasswordController()),
  );
  router.patch(
    '/password',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeUpdatePasswordController()),
  );

  router.patch(
    '/admin',
    adaptMiddleware(makeAuthMiddleware(true)),
    adaptRoute(makeGrantAdminController()),
  );
  router.delete(
    '/user',
    adaptMiddleware(makeAuthMiddleware(true)),
    adaptRoute(makeDeleteUserController()),
  );
};
