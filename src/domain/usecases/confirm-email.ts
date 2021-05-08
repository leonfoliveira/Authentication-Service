export interface ConfirmEmail {
  /**
   * @throws UserNotFoundException, EmailAlreadyConfirmedException
   */
  confirm: (confirmToken: string) => Promise<void>;
}
