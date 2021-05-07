import { User } from '@/domain/models';

export interface SendPasswordResetEmail {
  send: (user: User) => Promise<void>;
}
