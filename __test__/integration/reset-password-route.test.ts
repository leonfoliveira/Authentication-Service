import request from 'supertest';

import app from '@/main/config/app';
import { MemoryDb, mockAuthorization } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

const mockRequest = (): any => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

describe('ResetPasswordRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should get an Authorization', async () => {
    const user = await mockUserEntity({});
    const httpResponse = await request(app)
      .post('/api/reset')
      .set('authorization', mockAuthorization(user))
      .send(mockRequest().body);
    expect(httpResponse.status).toBe(204);
  });
});
