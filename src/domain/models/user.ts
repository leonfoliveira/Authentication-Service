export class User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  emailConfirmedAt: Date;
  emailConfirmToken: string;
  passwordResetToken: string;
}
