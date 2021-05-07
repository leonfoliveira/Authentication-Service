import { User } from '@/domain/models';

export interface FindUserByPasswordResetTokenRepository {
  findByPasswordResetToken: (
    passwordResetToken: string,
  ) => Promise<FindUserByPasswordResetTokenRepositoryResult>;
}

export type FindUserByPasswordResetTokenRepositoryResult = User;
