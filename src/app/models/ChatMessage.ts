import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import { User, Chat } from './index';

@Entity({ name: 'ChatMessage' })
export class ChatMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'typeMessage',
  })
  typeMessage: string | 'text' | 'image';

  @Column('varchar', {
    name: 'message',
  })
  message: string;
  
  @ManyToOne(() => User,  user => user.chatMessages, {
    onDelete: 'CASCADE',
  })
  fromUser: User | number;

  @ManyToOne(() => Chat,  chat => chat.chatMessages, {
    onDelete: 'CASCADE',
  })
  chat: Chat | number;

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
