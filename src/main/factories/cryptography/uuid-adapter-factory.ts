import { UuidAdapter } from '@/infra/criptography';

export const makeUuidAdapter = (): UuidAdapter => new UuidAdapter();
