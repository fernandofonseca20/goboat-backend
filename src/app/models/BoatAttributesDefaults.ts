import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { UserExperience } from './index';

@Entity({ name: 'BoatAttributesDefaults' })
export class BoatAttributesDefaults {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'title',
  })
  title: string;

  @Column('boolean', {
    name: 'actived',
    default: true,
    select: false,
  })
  actived: boolean;

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
