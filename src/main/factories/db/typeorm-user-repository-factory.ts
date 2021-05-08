import { TypeormUserRepository } from '@/infra/db';

export const makeTypeormUserRepository = (): TypeormUserRepository => new TypeormUserRepository();
