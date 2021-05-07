export interface RevokeAllRefreshTokensByUserRepository {
  revokeAll: (id: string) => Promise<void>;
}
