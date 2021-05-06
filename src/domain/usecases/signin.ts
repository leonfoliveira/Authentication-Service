import { Authorization } from '@/domain/models';

export interface Signin {
  attempt: (params: SigninDTO) => Promise<Authorization>;
}

export type SigninDTO = {
  email: string;
  password: string;
};
