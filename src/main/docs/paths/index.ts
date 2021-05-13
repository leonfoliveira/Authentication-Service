import confirmPath from './confirm-path.json';
import deleteUserPath from './delete-user-path.json';
import grantAdminPath from './grant-admin-path.json';
import refreshPath from './refresh-authorization-path.json';
import resetPasswordPath from './reset-password-path.json';
import signinPath from './signin-path.json';
import signupPath from './signup-path.json';
import updatePasswordPath from './update-password-path.json';
import updateUser from './update-user-path.json';

export const paths = {
  '/auth/signin': signinPath,
  '/auth/signup': signupPath,
  '/auth/password/{passwordResetToken}': updatePasswordPath,
  '/auth/reset': resetPasswordPath,
  '/auth/refresh': refreshPath,
  '/user/{userId}/update': updateUser,
  '/user/confirm/{emailConfirmToken}': confirmPath,
  '/user/{userId}/delete': deleteUserPath,
  '/user/{userId}/grant': grantAdminPath,
};
