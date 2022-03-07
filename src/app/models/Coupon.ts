import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { BoatRents } from './index';

@Entity({ name: 'Coupon' })
export class Coupon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'title',
  })
  title: string;

  @Column('jsonb', {
    name: 'roles',
  })
  roles: object;

  @Column('varchar', {
    name: 'code',
  })
  code: string;
  
  @OneToMany(() => BoatRents, (rent) => rent.coupon, {
    onDelete: 'CASCADE',
  })
  boatRents?: BoatRents[];

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
