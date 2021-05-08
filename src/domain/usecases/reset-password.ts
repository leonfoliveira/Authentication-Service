export interface ResetPassword {
  /**
   * @throws UserNotFoundException
   */
  reset: (id: string) => Promise<void>;
}
