export interface CreateRefreshTokenRepository {
  create: (refreshToken: string) => Promise<void>;
}
