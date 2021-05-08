export interface DeleteUser {
  /**
   * @throws UserNotFoundException
   */
  delete: (id: string) => Promise<void>;
}
