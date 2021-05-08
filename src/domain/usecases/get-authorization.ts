import { Authorization, User } from '@/domain/models';

export interface GetAuthorization {
  get: (user: User) => Promise<Authorization>;
}
