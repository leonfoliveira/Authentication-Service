import { Authorization } from '@/domain/models';
import { GetAuthorization, Signin, SigninDTO } from '@/domain/usecases';

import { FindUserByEmailRepository, HashComparer } from '../interfaces';

export class DbSignin implements Signin {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly getAuthorization: GetAuthorization,
  ) {}

  async attempt(params: SigninDTO): Promise<Authorization> {
    const user = await this.findUserByEmailRepository.findByEmail(params.email);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const isPasswordCorrect = await this.hashComparer.compare(params.password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('INCORRECT_PASSWORD');
    }

    const authorization = await this.getAuthorization.get(user);

    return authorization;
  }
}
