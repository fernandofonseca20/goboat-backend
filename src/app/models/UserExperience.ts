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

@Entity({ name: 'UserExperience' })
export class UserExperience {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => BoatCategory, (category) => category.userExperiences, { onDelete: 'CASCADE' })
  boatCategory: BoatCategory | number;

  @ManyToOne(() => User, (user) => user.userExperiences, { onDelete: 'CASCADE' })
  user: User | number;


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
