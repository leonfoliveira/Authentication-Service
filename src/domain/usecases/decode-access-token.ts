import { User } from '@/domain/models';

export interface DecodeAccessToken {
  decode: (accessToken: string) => User;
}
