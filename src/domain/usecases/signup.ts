import { User } from '@/domain/models';

export interface Signup {
  /**
   * @throws EmailInUseException
   */
  attempt: (params: SignupDTO) => Promise<User>;
}

export type SignupDTO = {
  name: string;
  surname: string;
  email: string;
  password: string;
};
