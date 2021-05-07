import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { EmailSender } from '@/application/interfaces';
import { LocalSendConfirmationEmail } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';

type SutTypes = {
  sut: LocalSendConfirmationEmail;
  emailSenderSpy: MockProxy<EmailSender>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const emailSenderSpy = mock<EmailSender>();
  const sut = new LocalSendConfirmationEmail(url, emailSenderSpy);

  return { sut, emailSenderSpy };
};

describe('LocalSendConfirmationEmail', () => {
  it('should call EmailSender with correct params', async () => {
    const url = faker.internet.url();
    const { sut, emailSenderSpy } = makeSut(url);
    const params = mockUser();

    await sut.send(params);

    expect(emailSenderSpy.send).toHaveBeenCalledWith(
      params.email,
      'Email Confirmation',
      `<div>
        <h1>Email Confirmation</h1>
        <h2>Hello ${params.name}!</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${url}/${params.emailConfirmToken}> Click here</a>
      </div>`,
    );
  });
});
