import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

import {
  User,
  Boat
} from './index';

@Entity({ name: 'UserPaymentMethod' })
export class UserPaymentMethod {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.userSaves, { onDelete: 'CASCADE' })
  user: User | number;


  @Column({
    name: 'number',
    type: 'varchar',
  })
  number: string;

  @Column({
    name: 'expiryDate',
    type: 'varchar',
  })
  expiryDate: string;

  @Column({
    name: 'cvv',
    type: 'varchar',
  })
  cvv: string;

  @Column({
    name: 'holderName',
    type: 'varchar',
  })
  holderName: string;

  @Column({
    name: 'holderDocument',
    type: 'varchar',
  })
  holderDocument: string;

  @Column({
    name: 'credit',
    type: 'boolean',
    default: 1
  })
  credit: boolean;

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
