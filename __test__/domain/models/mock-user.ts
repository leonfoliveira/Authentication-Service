import faker from 'faker';

import { User } from '@/domain/models';

export const mockUser = (): User => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailConfirmedAt: faker.date.recent(),
  isAdmin: faker.datatype.boolean(),
  emailConfirmToken: faker.datatype.uuid(),
  passwordResetToken: faker.datatype.uuid(),
});
