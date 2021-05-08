import { Connection, createConnection } from 'typeorm';

import { RefreshTokensEntity, UserEntity } from '@/infra/entities';

export const MemoryDb = {
  connection: null as Connection,

  async connect(): Promise<void> {
    this.connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: ['src/infra/entities/**/*.ts'],
    });
  },

  async clear(): Promise<void> {
    await RefreshTokensEntity.delete({});
    await UserEntity.delete({});
  },

  async disconnect(): Promise<void> {
    await this.connection.close();
  },
};
