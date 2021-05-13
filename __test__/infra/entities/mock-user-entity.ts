import bcrypt from 'bcrypt';

import { UserEntity } from '@/infra/entities';

export const mockUserEntity = async ({
  name,
  surname,
  email,
  password,
  emailConfirmedAt,
  emailConfirmToken,
  passwordResetToken,
  isAdmin,
}: {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  emailConfirmedAt?: Date;
  emailConfirmToken?: string;
  passwordResetToken?: string;
  isAdmin?: boolean;
}): Promise<UserEntity> => {
  const user = new UserEntity();
  user.name = name || 'any_name';
  user.surname = surname || 'any_surname';
  user.email = email || 'any_mail@mail.com';
  user.password = await bcrypt.hash(password || 'any_password', 12);
  user.emailConfirmedAt = emailConfirmedAt !== undefined ? emailConfirmedAt : new Date();
  user.emailConfirmToken = emailConfirmToken || 'any_token';
  user.passwordResetToken = passwordResetToken || 'any_token';
  user.isAdmin = isAdmin || false;
  return user.save();
};
