export interface RevokeAllRefreshTokensByUserRepository {
  revokeAll: (userId: string) => Promise<void>;
}
