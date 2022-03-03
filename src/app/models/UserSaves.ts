import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  User,
  Boat
} from './index';

@Entity({ name: 'UserSaves' })
export class UserSaves {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Boat, (boat) => boat.userSaves, { onDelete: 'CASCADE' })
  boat: Boat | number;

  @ManyToOne(() => User, (user) => user.userSaves, { onDelete: 'CASCADE' })
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
