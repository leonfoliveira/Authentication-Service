import { User } from '@/domain/models';

export interface DecodeAccessToken {
  /**
   * @throws InvalidAccessTokenException
   */
  decode: (accessToken: string) => User;
}
