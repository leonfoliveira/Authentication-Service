import {
  CreateRefreshTokenRepository,
  StatelessTokenGenerator,
  TokenGenerator,
} from '@/application/interfaces';
import { Authorization, User } from '@/domain/models';
import { GetAuthorization } from '@/domain/usecases';

export class DbGetAuthorization implements GetAuthorization {
  constructor(
    private readonly tokenGenerator: TokenGenerator,
    private readonly statelessTokenGenerator: StatelessTokenGenerator,
    private readonly createRefreshTokenRepository: CreateRefreshTokenRepository,
  ) {}

  async get(user: User): Promise<Authorization> {
    const refreshToken = this.tokenGenerator.generate();
    const accessToken = this.statelessTokenGenerator.generate(user);

    await this.createRefreshTokenRepository.create(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
