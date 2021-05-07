import faker from 'faker';
import nodemailer, { TransportOptions } from 'nodemailer';

import { NodemailerAdapter } from '@/infra/utils';
import { getReturn } from '@/test/helpers';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

const makeSut = (sender: string, options: TransportOptions): NodemailerAdapter =>
  new NodemailerAdapter(sender, options);

describe('NodemailAdapter', () => {
  it('should create nodemailer.transport instance and call sendMail with correct params', async () => {
    const sender = faker.internet.email();
    const options = {
      host: faker.internet.url(),
      port: faker.internet.port(),
      auth: {
        user: faker.random.word(),
        pass: faker.internet.password(),
      },
    } as TransportOptions;
    const sut = makeSut(sender, options);
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');
    const to = faker.internet.email();
    const subject = faker.random.word();
    const content = faker.random.words();

    sut.send(to, subject, content);

    expect(createTransportSpy).toHaveBeenCalledWith(options);
    expect(getReturn(createTransportSpy).sendMail.mock.calls[0][0]).toHaveProperty('from', sender);
    expect(getReturn(createTransportSpy).sendMail.mock.calls[0][0]).toHaveProperty('to', to);
    expect(getReturn(createTransportSpy).sendMail.mock.calls[0][0]).toHaveProperty(
      'subject',
      subject,
    );
    expect(getReturn(createTransportSpy).sendMail.mock.calls[0][0].html).toMatch(content);
  });
});
