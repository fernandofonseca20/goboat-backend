import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { UserExperience, Boat } from './index';

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

  @OneToMany(() => Boat, (userExperience) => userExperience.boatCategory, {
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
