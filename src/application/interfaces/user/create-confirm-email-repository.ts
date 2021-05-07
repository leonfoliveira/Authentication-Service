export interface CreateConfirmEmailRepository {
  confirm: (id: string) => Promise<void>;
}
