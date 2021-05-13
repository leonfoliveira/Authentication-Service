import { components } from './components';
import { paths } from './paths';
import { schemas } from './schemas';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Authentication Service',
    description: 'A basic authentication service',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Authentication' }],
  components,
  paths,
  schemas,
};
