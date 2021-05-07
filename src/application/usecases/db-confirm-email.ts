import {
  FindUserByEmailConfirmTokenRepository,
  UserConfirmEmailRepository,
} from '@/application/interfaces';
import { ConfirmEmail } from '@/domain/usecases';

export class DbConfirmEmail implements ConfirmEmail {
  constructor(
    private readonly findUserByEmailConfirmTokenRepository: FindUserByEmailConfirmTokenRepository,
    private readonly userConfirmEmailRepository: UserConfirmEmailRepository,
  ) {}

  async confirm(emailConfirmToken: string): Promise<void> {
    const user = await this.findUserByEmailConfirmTokenRepository.findByEmailConfirmToken(
      emailConfirmToken,
    );
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.emailConfirmedAt !== null) {
      throw new Error('EMAIL_ALREADY_CONFIRMED');
    }

    await this.userConfirmEmailRepository.confirmEmail(user.id);
  }
}
