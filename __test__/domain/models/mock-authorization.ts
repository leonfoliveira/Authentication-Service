import faker from 'faker';

import { Authorization } from '@/domain/models';

import { mockUser } from './mock-user';

export const mockAuthorization = (): Authorization => ({
  accessToken: faker.datatype.uuid(),
  refreshToken: faker.datatype.uuid(),
  user: mockUser(),
});
