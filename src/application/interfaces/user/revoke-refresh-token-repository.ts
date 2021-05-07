export interface RevokeRefreshTokenRepository {
  revoke: (refreshToken: string) => Promise<void>;
}
