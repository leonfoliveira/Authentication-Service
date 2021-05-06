export interface UpdatePassword {
  update: (id: string, password: string) => Promise<void>;
}
