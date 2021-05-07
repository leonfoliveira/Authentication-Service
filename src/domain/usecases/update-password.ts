export interface UpdatePassword {
  update: (passwordResetToken: string, password: string) => Promise<void>;
}
