import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user-entity';

@Entity('RefreshTokens')
export class RefreshTokensEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  user: UserEntity;

  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  issuedAt: Date;

  @DeleteDateColumn()
  revokedAt?: Date;
}
