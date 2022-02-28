import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Boat } from './index';

@Entity({ name: 'BoatAttributes' })
export class BoatAttributes {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'title',
  })
  title: string;

  @ManyToOne(() => Boat, (boat) => boat.boatAttributes, {
    onDelete: 'CASCADE',
  })
  boat?: Boat | number;

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
