import jwt from 'jsonwebtoken';

import { StatelessTokenGenerator } from '@/application/interfaces';

export class JwtAdapter implements StatelessTokenGenerator {
  constructor(private readonly secret: string) {}

  generate(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secret);
  }
}
