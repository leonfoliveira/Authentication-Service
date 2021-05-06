export interface ConfirmEmail {
  confirm: (confirmToken: string) => Promise<void>;
}
