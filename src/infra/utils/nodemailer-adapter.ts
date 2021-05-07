import nodemailer, { TransportOptions } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { EmailSender } from '@/application/interfaces';

export class NodemailerAdapter implements EmailSender {
  private transport: Mail;

  constructor(private readonly sender: string, options: TransportOptions) {
    this.transport = nodemailer.createTransport(options);
  }

  async send(to: string, subject: string, content: string): Promise<void> {
    await this.transport.sendMail({
      from: this.sender,
      to,
      subject,
      html: `<style>* { font-family: Arial, Helvetica, sans-serif; }</style>${content}`,
    });
  }
}
