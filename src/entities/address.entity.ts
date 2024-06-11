import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity.js';

@Entity()
export class Pincode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  pincode: string;

  @OneToMany(() => PostOffices, po => po.pincode, { eager: false })
  postOffices: PostOffices[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class PostOffices extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  circle: string;

  @Column({ type: 'varchar' })
  district: string;

  @Column({ type: 'varchar' })
  division: string;

  @Column({ type: 'varchar' })
  region: string;

  @Column({ type: 'varchar' })
  block: string;

  @Column({ type: 'varchar' })
  state: string;

  @ManyToOne(() => Pincode, p => p.id, { eager: false })
  @JoinColumn({ name: 'pincode_id' })
  pincode: Pincode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Zone extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => Pincode, p => p.id, { eager: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'zone_pincode' })
  pincodes: Pincode[];

  @ManyToMany(() => Product, p => p.allowZones)
  @JoinTable()
  products: Product[];

  @Column({ type: 'float' })
  deliveryCharges: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  mobile: string;

  @Column({ type: 'varchar', nullable: true })
  alternatePhone: string;

  @ManyToOne(() => Pincode, p => p.id, { eager: true })
  @JoinColumn({ name: 'pincode_id' })
  pincode: Pincode;

  @Column({ type: 'varchar' })
  locality: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  landmark: string;

  @Column({ type: 'varchar' })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
