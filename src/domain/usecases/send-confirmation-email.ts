import { User } from '@/domain/models';

export interface SendConfirmationEmail {
  send: (user: User) => Promise<void>;
}
