import faker from 'faker';
import { mock, MockProxy } from 'jest-mock-extended';

import { EmailSender } from '@/application/interfaces';
import { LocalSendPasswordResetEmail } from '@/application/usecases';
import { mockUser } from '@/test/domain/models';

type SutTypes = {
  sut: LocalSendPasswordResetEmail;
  emailSenderSpy: MockProxy<EmailSender>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const emailSenderSpy = mock<EmailSender>();
  const sut = new LocalSendPasswordResetEmail(url, emailSenderSpy);

  return { sut, emailSenderSpy };
};

describe('LocalSendPasswordResetEmail', () => {
  it('should call EmailSender with correct params', async () => {
    const url = faker.internet.url();
    const { sut, emailSenderSpy } = makeSut(url);
    const params = mockUser();

    await sut.send(params);

    expect(emailSenderSpy.send).toHaveBeenCalledWith(
      params.email,
      'Password Reset',
      `<div>
        <h1>Password Reset</h1>
        <h2>Hello ${params.name}!</h2>
        <p>Please click on the following link to change your password.</p>
        <a href=${url}/${params.passwordResetToken}> Click here</a>
      </div>`,
    );
  });
});
