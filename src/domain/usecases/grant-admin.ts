export interface GrantAdmin {
  /**
   * @throws UserNotFoundException
   */
  grant: (id: string) => Promise<void>;
}
