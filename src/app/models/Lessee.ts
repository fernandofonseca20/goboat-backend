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
  LesseeReceivingData,
  Chat,
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
  
  @OneToMany(() => LesseeReceivingData, (receivingDatas) => receivingDatas.lessee, {
    onDelete: 'CASCADE',
  })
  receivingDatas: LesseeReceivingData[];
  
  @OneToMany(() => Chat, (chat) => chat.user, {
    onDelete: 'CASCADE',
  })
  chats?: Chat[];

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
