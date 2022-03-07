import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Boat, Coupon, UserPaymentMethod, User} from './index';

@Entity({ name: 'BoatRents' })
export class BoatRents {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'status',
  })
  status: string;

  @Column('varchar', {
    name: 'paymentStatus',
    nullable: true
  })
  paymentStatus: string;

  @Column('varchar', {
    name: 'code',
  })
  code: string;

  @Column('integer', {
    name: 'peoples',
  })
  peoples: number;

  @Column('double precision', {
    name: 'amountTotal',
  })
  amount: number;

  @Column('double precision', {
    name: 'amountLesse',
  })
  amountLesse: number;

  @Column('double precision', {
    name: 'amountRetention',
  })
  amountRetention: number;

  @Column('timestamptz', {
    name: 'checkin',
  })
  checkin: Date;

  @Column('timestamptz', {
    name: 'checkout',
  })
  checkout: Date;
  
  @Column('varchar', {
    name: 'typePayment',
  })
  typePayment: string;

  @ManyToOne(() => User, (user) => user.boatRents, {
    onDelete: 'CASCADE',
  })
  user: User | number;

  @ManyToOne(() => Boat, (boat) => boat.boatAttributes, {
    onDelete: 'CASCADE',
  })
  boat: Boat | number;

  @ManyToOne(() => Coupon, (coupon) => coupon.boatRents, {
    onDelete: 'CASCADE',
  })
  coupon?: Coupon | number;

  @ManyToOne(() => UserPaymentMethod, (card) => card.boatRents, {
    onDelete: 'CASCADE',
  })
  card?: UserPaymentMethod | number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    select: false,
  })
  updatedAt: Date;
}
