import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BoatRents, User, Lessee, ChatMessage } from './index';

@Entity({ name: 'Chat' })
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('boolean', {
    name: 'open',
  })
  open: boolean;

  @Column('varchar', {
    name: 'status',
  })
  status: string | 'goBoat' | 'lessee';
  
  @OneToOne(() => BoatRents,  {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  boatRent: BoatRents | number;
  
  @ManyToOne(() => User,  user => user.chats, {
    onDelete: 'CASCADE',
  })
  user: User | number;

  @ManyToOne(() => ChatMessage,  message => message.chat, {
    onDelete: 'CASCADE',
  })
  chatMessages: ChatMessage | number;
  
  @ManyToOne(() => Lessee,  user => user.chats, {
    onDelete: 'CASCADE',
  })
  lessee: Lessee | number;

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
