import { EmailSender } from '@/application/interfaces';
import { User } from '@/domain/models';
import { SendConfirmationEmail } from '@/domain/usecases';

export class LocalSendConfirmationEmail implements SendConfirmationEmail {
  constructor(private readonly url: string, private readonly emailSender: EmailSender) {}

  async send(params: User): Promise<void> {
    await this.emailSender.send(
      params.email,
      'Email Confirmation',
      `<div>
        <h1>Email Confirmation</h1>
        <h2>Hello ${params.name}!</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${this.url}/${params.emailConfirmToken}> Click here</a>
      </div>`,
    );
  }
}
