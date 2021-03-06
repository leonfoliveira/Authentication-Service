import { FindUserRepository, TokenGenerator, UpdateUserRepository } from '@/application/interfaces';
import { UserNotFoundException } from '@/domain/errors';
import { ResetPassword, SendPasswordResetEmail } from '@/domain/usecases';

export class DbResetPassword implements ResetPassword {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly sendPasswordResetEmail: SendPasswordResetEmail,
  ) {}

  async reset(id: string): Promise<void> {
    const user = await this.findUserRepository.find(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const passwordResetToken = this.tokenGenerator.generate();
    const updatedUser = await this.updateUserRepository.update(id, { passwordResetToken });

    await this.sendPasswordResetEmail.send(updatedUser);
  }
}
