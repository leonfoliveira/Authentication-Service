import request from 'supertest';

import { UserEntity } from '@/infra/entities';
import app from '@/main/config/app';
import { MemoryDb } from '@/test/helpers';

const mockRequest = (): any => ({
  body: {
    name: 'any_name',
    surname: 'any_surname',
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

describe('SignupRoute', () => {
  beforeAll(MemoryDb.connect);

  afterAll(MemoryDb.disconnect);

  it('should create a new User', async () => {
    const httpResponse = await request(app).post('/api/auth/signup').send(mockRequest().body);
    const user = await UserEntity.findOne();
    expect(httpResponse.status).toBe(201);
    expect(httpResponse.body).toHaveProperty('id', user.id);
  });
});
