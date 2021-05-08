export interface UpdatePassword {
  /**
   * @throws UserNotFoundException
   */
  update: (passwordResetToken: string, password: string) => Promise<void>;
}
