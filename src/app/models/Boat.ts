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
  Lessee,
  BoatLicense,
  BoatAttributes,
  BoatCategory,
} from './index';

@Entity({ name: 'Boat' })
export class Boat {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'maximumCapacity',
    type: 'integer',
  })
  maximumCapacity: number;

  @Column({
    name: 'pricePerDay',
    type: 'double precision',
    default: 0,
  })
  pricePerDay: number;

  @Column({
    name: 'promotion',
    type: 'boolean',
    default: false,
  })
  promotion: boolean;

  @Column({
    name: 'priceOff',
    type: 'double precision',
    nullable: true
  })
  priceOff: number;

  @Column({
    name: 'percentageOff',
    type: 'integer',
    nullable: true
  })
  percentageOff: number;

  @Column({
    name: 'city',
    type: 'varchar',
    nullable: true
  })
  city: string;

  @Column({
    name: 'state',
    type: 'varchar',
    nullable: true
  })
  state: string;

  @Column({
    name: 'beach',
    type: 'varchar',
    nullable: true
  })
  beach: string;

  @Column({
    name: 'image',
    type: 'varchar',
    nullable: true
  })
  image: string;

  @Column({
    name: 'chekinHour',
    type: 'varchar',
  })
  chekinHour: string;

  @Column({
    name: 'checkoutHour',
    type: 'varchar',
  })
  checkoutHour: string;

  @Column({
    name: 'images',
    type: 'json',
    nullable: true
  })
  images: object;

  @Column({
    name: 'localization',
    type: 'json',
    nullable: true
  })
  localization: object;

  @ManyToOne(() => Lessee, (lesse) => lesse.boats, {
    onDelete: 'CASCADE',
  })
  lessee: Lessee | number;

  @ManyToOne(() => BoatLicense, (boat) => boat.boats, {
    onDelete: 'CASCADE',
  })
  license?: BoatLicense | number;

  @OneToMany(() => BoatAttributes, (attributes) => attributes.boat, {
    onDelete: 'CASCADE',
  })
  boatAttributes?: BoatAttributes[];

  @ManyToOne(() => BoatCategory, (category) => category.boats, {
    onDelete: 'CASCADE',
  })
  boatCategory?: BoatCategory | number;
 

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
