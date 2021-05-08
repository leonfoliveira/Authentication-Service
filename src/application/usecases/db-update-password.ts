import {
  FindUserByPasswordResetTokenRepository,
  HashGenerator,
  RevokeAllRefreshTokensByUserRepository,
  UpdateUserRepository,
} from '@/application/interfaces';
import { UserNotFoundException } from '@/domain/errors';
import { UpdatePassword } from '@/domain/usecases';

export class DbUpdatePassword implements UpdatePassword {
  constructor(
    private readonly findUserByPasswordResetTokenRepository: FindUserByPasswordResetTokenRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly revokeAllRefreshTokensByUserRepository: RevokeAllRefreshTokensByUserRepository,
  ) {}

  async update(passwordResetToken: string, password: string): Promise<void> {
    const user = await this.findUserByPasswordResetTokenRepository.findByPasswordResetToken(
      passwordResetToken,
    );
    if (!user) {
      throw new UserNotFoundException();
    }

    const hashedPassword = await this.hashGenerator.generate(password);

    await this.updateUserRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
    });

    await this.revokeAllRefreshTokensByUserRepository.revokeAll(user.id);
  }
}
