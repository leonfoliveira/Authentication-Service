import apiKeyAuthSchema from './api-key-auth-schema.json';
import badRequestComponent from './bad-request.json';
import conflictComponent from './conflict.json';
import forbiddenComponent from './forbidden.json';
import internalServerErrorComponent from './internal-server-error.json';
import notFoundComponent from './not-found.json';
import unauthorizedComponent from './unauthorized.json';

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  'bad-request': badRequestComponent,
  conflict: conflictComponent,
  forbidden: forbiddenComponent,
  'internal-server-error': internalServerErrorComponent,
  'not-found': notFoundComponent,
  unauthorized: unauthorizedComponent,
};
