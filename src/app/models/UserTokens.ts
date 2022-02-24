import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compare, hash } from 'bcrypt';

import {
  User,
  BoatCategory
} from './index';

@Entity({ name: 'UserTokens' })
export class UserTokens {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @ManyToOne(() => User, (user) => user.userExperiences, { onDelete: 'CASCADE' })
  // user: User | number;

  @Column('integer', {
    name: 'token',
  })
  token: number;


  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
