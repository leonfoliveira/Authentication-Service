import request from 'supertest';

import app from '@/main/config/app';
import { MemoryDb } from '@/test/helpers';
import { mockRefreshToken, mockUserEntity } from '@/test/infra/entities';

describe('RefreshAuthorizationRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should get a new Authorization', async () => {
    const user = await mockUserEntity({});
    const refreshToken = await mockRefreshToken(user, 'any_token');
    const httpResponse = await request(app)
      .post('/api/auth/refresh')
      .set('refreshtoken', refreshToken.token)
      .send();
    expect(httpResponse.status).not.toBe(500);
  });
});
