import request from 'supertest';

import { UserEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb, mockAuthorization } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

describe('DeleteUserRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should delete a User', async () => {
    const user = await mockUserEntity({});
    const httpResponse = await request(app)
      .delete(`/api/user/${user.id}/delete`)
      .set('authorization', mockAuthorization(user))
      .send();
    expect(httpResponse.status).toBe(204);
    expect(await UserEntity.findOne()).toBeFalsy();
  });
});
