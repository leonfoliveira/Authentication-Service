export interface UserGrantAdminRepository {
  grant: (id: string) => Promise<void>;
}
