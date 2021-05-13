export default {
  createTransport: (): any => ({
    sendMail: jest.fn(),
  }),
};
