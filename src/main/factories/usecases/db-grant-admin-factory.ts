import { DbGrantAdmin } from '@/application/usecases';
import { makeTypeormUserRepository } from '@/main/factories/db';

export const makeDbGrantAdmin = (): DbGrantAdmin =>
  new DbGrantAdmin(makeTypeormUserRepository(), makeTypeormUserRepository());
