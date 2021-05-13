import jwt from 'jsonwebtoken';

import { UserEntity } from '@/infra/entities';

export const mockAuthorization = (user: UserEntity): string => {
  return `Bearer ${jwt.sign({ ...user }, process.env.SECRET)}`;
};
