import {
  BeforeInsert,
  Column,
  JoinColumn,
  CreateDateColumn,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  User,
  Boat,
} from './index';

@Entity({ name: 'Lessee' })
export class Lessee {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User | number;

  
  @OneToMany(() => Boat, (boat) => boat.lessee, {
    onDelete: 'CASCADE',
  })
  boats: Boat[];

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
