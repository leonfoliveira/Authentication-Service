import { JwtAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export const makeJwtAdapter = (): JwtAdapter => new JwtAdapter(env.jwtSecret);
