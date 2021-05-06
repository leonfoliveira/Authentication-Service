export interface GrantAdmin {
  grant: (id: string) => Promise<void>;
}
