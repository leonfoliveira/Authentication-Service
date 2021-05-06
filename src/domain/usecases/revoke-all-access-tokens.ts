export interface RevokeAllAccessTokens {
  revokeAll: (id: string) => Promise<void>;
}
