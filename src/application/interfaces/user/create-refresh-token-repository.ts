export interface CreateRefreshTokenRepository {
  create: (token: string, userId: string) => Promise<void>;
}
