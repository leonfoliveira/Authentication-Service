import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RefreshTokensEntity } from './refresh-token-entity';

@Entity('Users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  emailConfirmedAt: Date;

  @Column({ nullable: true, unique: true })
  emailConfirmToken: string;

  @Column({ nullable: true, unique: true })
  passwordResetToken: string;

  @OneToMany(() => RefreshTokensEntity, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshTokensEntity[];

  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt?: Date;
}
