import { Authorization } from '@/domain/models';

export interface RefreshAuthorization {
  refresh: (refreshToken: string) => Promise<Authorization>;
}
