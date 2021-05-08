import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export const makeBcryptAdapter = (): BcryptAdapter => new BcryptAdapter(env.bcryptRounds);
