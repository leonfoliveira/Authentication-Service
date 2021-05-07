export interface CreateRefreshTokenRepository {
  createRefreshToken: (refreshToken: string) => Promise<void>;
}
