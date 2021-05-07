import { v4 as uuid } from 'uuid';

import { TokenGenerator } from '@/application/interfaces';

export class UuidAdapter implements TokenGenerator {
  generate(): string {
    return uuid();
  }
}
