import { Authorization, ProtectedUser } from '@/domain/models';

export interface GetAuthorization {
  get: (user: ProtectedUser) => Promise<Authorization>;
}
