export interface RevokeAllRefreshTokens {
  revokeAll: (id: string) => Promise<void>;
}
