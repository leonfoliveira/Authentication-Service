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

  router.post('/auth/signup', adaptRoute(makeSignupController()));
  router.post('/user/confirm/:emailConfirmToken', adaptRoute(makeConfirmEmailController()));
  router.post('/auth/signin', adaptRoute(makeSigninController()));
  router.post('/auth/password/:passwordResetToken', adaptRoute(makeUpdatePasswordController()));
  router.post('/auth/refresh', adaptRoute(makeRefreshAuthorizationController()));

  router.put(
    '/user/:id/update',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeUpdateUserController()),
  );
  router.post(
    '/auth/reset',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeResetPasswordController()),
  );
  router.delete(
    '/user/:id/delete',
    adaptMiddleware(makeAuthMiddleware()),
    adaptRoute(makeDeleteUserController()),
  );

  router.patch(
    '/user/:userId/grant',
    adaptMiddleware(makeAuthMiddleware(true)),
    adaptRoute(makeGrantAdminController()),
  );
};
