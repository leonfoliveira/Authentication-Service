import bcrypt from 'bcrypt';

import { HashComparer, HashGenerator } from '@/application/interfaces';

export class BcryptAdapter implements HashGenerator, HashComparer {
  constructor(private readonly rounds: number) {}

  async generate(value: string): Promise<string> {
    return bcrypt.hash(value, this.rounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
