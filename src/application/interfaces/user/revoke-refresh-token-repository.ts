export interface RevokeRefreshTokenRepository {
  revoke: (token: string) => Promise<void>;
}
