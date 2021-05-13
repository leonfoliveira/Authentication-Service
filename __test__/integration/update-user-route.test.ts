import request from 'supertest';

import { UserEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb, mockAuthorization } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

const mockRequest = (): any => ({
  body: {
    name: 'any_other_name',
  },
});

describe('UpdateUserRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should update a User', async () => {
    const user = await mockUserEntity({});
    const httpResponse = await request(app)
      .put(`/api/user/${user.id}`)
      .set('authorization', mockAuthorization(user))
      .send(mockRequest().body);
    expect(httpResponse.status).toBe(200);
    expect(await UserEntity.findOne()).toHaveProperty('name', 'any_other_name');
  });
});
