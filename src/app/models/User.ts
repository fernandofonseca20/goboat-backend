import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { compare, hash } from 'bcrypt';

import {
  UserExperience,
  Lessee
} from './index';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    name: 'email',
  })
  email: string;

  @Column({
    name: 'password',
    select: false,
  })
  password: string;

  @Column('varchar', {
    name: 'first_name',
  })
  firstName: string;

  @Column('varchar', {
    name: 'last_name',
  })
  lastName: string;

  @Column('varchar', {
    name: 'fullName',
  })
  fullName: string;

  @Column('varchar', {
    name: 'documentNumber',
  })
  documentNumber: string;

  @Column('timestamptz', {
    name: 'bornDate',
  })
  bornDate: Date;

  @Column('varchar', {
    name: 'profile_image',
    nullable: true,
  })
  profileImage?: string;


  @Column('varchar', {
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @Column('boolean', {
    name: 'validated_email',
    default: false,
  })
  validatedEmail?: boolean;

  @Column('boolean', {
    name: 'validated_phone',
    default: false,
    select: false,
  })
  validatedPhone?: boolean;

  @Column('int', {
    name: 'code',
    nullable: true,
    select: false,
  })
  code?: number | null;


  @OneToOne(() => Lessee)
  @JoinColumn()
  lessee: Lessee | number;


  @OneToMany(() => UserExperience, (userExperience) => userExperience.user, {
    onDelete: 'CASCADE',
  })
  userExperiences?: UserExperience[];

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

  @BeforeInsert()
  async hashPassword(password?: string): Promise<string> {
    if (password) return hash(password, 10);
    this.password = await hash(this.password, 10);
    return this.password;
  }

  comparePassword(password: string) {
    return compare(password, this.password);
  }
}
