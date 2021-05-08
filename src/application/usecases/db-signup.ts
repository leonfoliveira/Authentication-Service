import {
  CreateUserRepository,
  FindUserByEmailRepository,
  HashGenerator,
  TokenGenerator,
} from '@/application/interfaces';
import { EmailInUseException } from '@/domain/errors';
import { User } from '@/domain/models';
import { SendConfirmationEmail, Signup, SignupDTO } from '@/domain/usecases';

export class DbSignup implements Signup {
  constructor(
    private readonly findUserByEmailRepositorySpy: FindUserByEmailRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly tokenGenerator: TokenGenerator,
    private readonly createUserRepository: CreateUserRepository,
    private readonly sendConfirmationEmail: SendConfirmationEmail,
  ) {}

  async attempt(params: SignupDTO): Promise<User> {
    const isEmailInUse = await this.findUserByEmailRepositorySpy.findByEmail(params.email);
    if (isEmailInUse) throw new EmailInUseException();

    const password = await this.hashGenerator.generate(params.password);
    const emailConfirmToken = this.tokenGenerator.generate();

    const user = await this.createUserRepository.create({
      ...params,
      password,
      emailConfirmToken,
    });

    await this.sendConfirmationEmail.send(user);

    return user;
  }
}
