import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { UserExperience } from './index';

@Entity({ name: 'BoatCategory' })
export class BoatCategory {
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

  @Column({
    name: 'imageUrl',
    nullable: true
  })
  imageUrl: string;

  @OneToMany(() => UserExperience, (userExperience) => userExperience.boatCategory, {
    onDelete: 'CASCADE',
  })
  userExperiences?: UserExperience[];

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
