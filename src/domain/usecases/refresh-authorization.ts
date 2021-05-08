import { Authorization } from '@/domain/models';

export interface RefreshAuthorization {
  /**
   * @throws UserNotFoundException
   */
  refresh: (refreshToken: string) => Promise<Authorization>;
}
