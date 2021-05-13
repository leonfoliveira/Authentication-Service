import apiKeyAuthSchema from './api-key-auth-schema.json';
import badRequestComponent from './bad-request.json';
import conflictComponent from './conflict.json';
import cookieAuth from './cookie-auth-schema.json';
import forbiddenComponent from './forbidden.json';
import notFoundComponent from './not-found.json';
import unauthorizedComponent from './unauthorized.json';

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
    cookieAuth,
  },
  'bad-request': badRequestComponent,
  conflict: conflictComponent,
  forbidden: forbiddenComponent,
  'not-found': notFoundComponent,
  unauthorized: unauthorizedComponent,
};
