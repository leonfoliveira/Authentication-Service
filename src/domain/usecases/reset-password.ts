export interface ResetPassword {
  reset: (id: string) => Promise<string>;
}
