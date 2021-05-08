import { User } from '@/domain/models';

export const protectUser = (user: User): any => ({
  id: user.id,
  name: user.name,
  surname: user.surname,
  email: user.email,
  isAdmin: user.isAdmin,
});
