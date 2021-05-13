import request from 'supertest';

import { RefreshTokensEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb, mockAuthorization } from '@/test/helpers';
import { mockRefreshToken, mockUserEntity } from '@/test/infra/entities';

const mockRequest = (): any => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

describe('RefreshAuthorizationRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should get a new Authorization', async () => {
    const user = await mockUserEntity({ email: 'any_email@mail.com', password: 'any_password' });
    const refreshToken = await mockRefreshToken(user, 'any_token');
    const httpResponse = await request(app)
      .post('/api/auth/refresh')
      .set('authorization', mockAuthorization(user))
      .set('cookie', `refreshToken=${refreshToken.token}`)
      .send(mockRequest().body);
    expect(httpResponse.status).toBe(200);
    expect(await RefreshTokensEntity.findOne()).toBeTruthy();
  });
});
