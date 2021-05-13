import bcrypt from 'bcrypt';
import request from 'supertest';

import { UserEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb } from '@/test/helpers';
import { mockUserEntity } from '@/test/infra/entities';

describe('PasswordResetRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should reset a password', async () => {
    const user = await mockUserEntity({
      passwordResetToken: 'any_token',
    });
    const httpResponse = await request(app).post(`/api/password/${user.passwordResetToken}`).send({
      password: 'any_password',
    });
    expect(httpResponse.status).toBe(204);
    expect(await bcrypt.compare('any_password', (await UserEntity.findOne()).password)).toBe(true);
  });
});
