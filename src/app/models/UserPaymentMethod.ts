import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

import {
  User,
  BoatRents
} from './index';

@Entity({ name: 'UserPaymentMethod' })
export class UserPaymentMethod {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.userSaves, { onDelete: 'CASCADE' })
  user: User | number;

  @OneToMany(() => BoatRents, (boat) => boat.paymentMethod, { onDelete: 'CASCADE' })
  boatRents: BoatRents[];

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
    name: 'expYear',
    type: 'varchar',
    default: '25'
  })
  expYear: string;

  @Column({
    name: 'expMonth',
    type: 'varchar',
    default: '11'
  })
  expMonth: string;

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
