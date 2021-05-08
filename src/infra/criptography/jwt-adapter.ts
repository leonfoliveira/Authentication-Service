import jwt from 'jsonwebtoken';

import { StatelessTokenDecoder, StatelessTokenGenerator } from '@/application/interfaces';

export class JwtAdapter implements StatelessTokenGenerator, StatelessTokenDecoder {
  constructor(private readonly secret: string) {}

  generate(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secret);
  }

  decode(statelessToken: string): Record<string, any> {
    try {
      return jwt.verify(statelessToken, this.secret) as Record<string, any>;
    } catch {
      return null;
    }
  }
}
