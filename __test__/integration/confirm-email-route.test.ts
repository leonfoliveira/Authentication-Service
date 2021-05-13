import request from 'supertest';

import app from '@/main/config/app';
import { MemoryDb } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

describe('SignupRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should confirm an Email', async () => {
    const user = await mockUserEntity({
      emailConfirmedAt: null,
    });
    const httpResponse = await request(app).post(`/api/confirm/${user.emailConfirmToken}`).send();
    expect(httpResponse.status).toBe(204);
  });
});
