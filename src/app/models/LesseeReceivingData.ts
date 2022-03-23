import {
  BeforeInsert,
  Column,
  JoinColumn,
  CreateDateColumn,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  Lessee
} from './index';

@Entity({ name: 'LesseeReceivingData' })
export class LesseeReceivingData {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Lessee, (lessee) => lessee.receivingDatas, { onDelete: 'CASCADE' })
  lessee: Lessee | number;

  @Column('boolean', {
    name: 'status',
    default: true
  })
  status: boolean;

  @Column('boolean', {
    name: 'principal',
    default: false,
  })
  principal: boolean;

  @Column('varchar', {
    name: 'stripeExternalAccount',
    nullable: true
  })
  stripeExternalAccount: string;

  @Column('varchar', {
    name: 'type',
  })
  type: string | 'pix' | 'bankAccount';

  @Column('varchar', {
    name: 'pixType',
    nullable: true
  })
  pixType: string | 'cpf' | 'phone' | 'email' | 'random';

  @Column('varchar', {
    name: 'pixKey',
    nullable: true
  })
  pixKey: string;

  @Column('varchar', {
    name: 'bankHolderName',
    nullable: true
  })
  bankHolderName: string;

  @Column('varchar', {
    name: 'bankAgency',
    nullable: true
  })
  bankAgency: string;

  @Column('varchar', {
    name: 'bank',
    nullable: true
  })
  bank: string;

  @Column('varchar', {
    name: 'bankHolderDocument',
    nullable: true
  })
  bankHolderDocument: string;

  @Column('varchar', {
    name: 'bankAccount',
    nullable: true
  })
  bankAccount: string;

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
