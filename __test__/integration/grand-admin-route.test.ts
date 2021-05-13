import request from 'supertest';

import { UserEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb, mockAuthorization } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

describe('GrandAdminRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should get an Authorization', async () => {
    const user = await mockUserEntity({ isAdmin: false });
    const admin = await mockUserEntity({
      email: 'other_email@mail.com',
      passwordResetToken: 'other_token',
      emailConfirmToken: 'other_token',
      isAdmin: true,
    });
    const httpResponse = await request(app)
      .patch(`/api/user/${user.id}/grant`)
      .set('authorization', mockAuthorization(admin))
      .send();
    expect(httpResponse.status).toBe(204);
    expect(await UserEntity.findOne(user.id)).toHaveProperty('isAdmin', true);
  });
});
