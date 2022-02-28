import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { Boat } from './index';

@Entity({ name: 'BoatLicense' })
export class BoatLicense {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    name: 'acronym',
  })
  acronym: string;

  @Column('varchar', {
    name: 'description',
  })
  description: string;

  @Column('boolean', {
    name: 'actived',
    default: true,
    select: false,
  })
  actived: boolean;

  @Column('integer', {
    name: 'nivel',
    select: false,
  })
  nivel: number;


  @OneToMany(() => Boat, (boat) => boat.license, {
    onDelete: 'CASCADE',
  })
  boats?: Boat[];

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
