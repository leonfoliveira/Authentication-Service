export interface UserConfirmEmailRepository {
  confirmEmail: (id: string) => Promise<void>;
}
