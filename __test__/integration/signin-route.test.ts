import request from 'supertest';

import { RefreshTokensEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

const mockRequest = (): any => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

describe('SigninRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should get an Authorization', async () => {
    await mockUserEntity({ email: 'any_email@mail.com', password: 'any_password' });
    const httpResponse = await request(app).post('/api/auth/signin').send(mockRequest().body);
    expect(httpResponse.status).toBe(200);
    expect(await RefreshTokensEntity.findOne()).toBeTruthy();
  });
});
