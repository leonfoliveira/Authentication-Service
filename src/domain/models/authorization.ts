import { User } from './user';

export class Authorization {
  refreshToken: string;
  accessToken: string;
  user: User;
}
