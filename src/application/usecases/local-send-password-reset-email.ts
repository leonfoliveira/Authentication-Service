import { EmailSender } from '@/application/interfaces';
import { User } from '@/domain/models';
import { SendPasswordResetEmail } from '@/domain/usecases';

export class LocalSendPasswordResetEmail implements SendPasswordResetEmail {
  constructor(private readonly url: string, private readonly emailSender: EmailSender) {}

  async send(user: User): Promise<void> {
    await this.emailSender.send(
      user.email,
      'Password Reset',
      `<div>
        <h1>Password Reset</h1>
        <h2>Hello ${user.name}!</h2>
        <p>Please click on the following link to change your password.</p>
        <a href=${this.url}/${user.passwordResetToken}> Click here</a>
      </div>`,
    );
  }
}
