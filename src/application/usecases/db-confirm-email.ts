import {
  FindUserByEmailConfirmTokenRepository,
  UserConfirmEmailRepository,
} from '@/application/interfaces';
import { EmailAlreadyConfirmedException, UserNotFoundException } from '@/domain/errors';
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
      throw new UserNotFoundException();
    }
    if (user.emailConfirmedAt !== null) {
      throw new EmailAlreadyConfirmedException();
    }

    await this.userConfirmEmailRepository.confirmEmail(user.id);
  }
}
