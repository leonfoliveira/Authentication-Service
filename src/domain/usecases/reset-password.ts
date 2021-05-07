export interface ResetPassword {
  reset: (id: string) => Promise<void>;
}
