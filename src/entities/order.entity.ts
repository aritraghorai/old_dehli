import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductItem } from './product.entity.js';
import { User } from './user.entiry.js';
import { Pincode } from './address.entity.js';

export enum ORDER_STATUS_ENUM {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
export enum PAYMENT_GATEWAY {
  RAZORPAY = 'RAZORPAY',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}
export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class OrderAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  mobile: string;

  @Column({ type: 'varchar', nullable: true })
  alternatePhone: string;

  @ManyToOne(() => Pincode, p => p.id, { onDelete: 'SET NULL' })
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

  @Column({ type: 'date' })
  deliveryDate: Date;

  @Column({ type: 'time' })
  startTime: Date;

  @Column({ type: 'time' })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class BillingAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Pincode, p => p.id, { onDelete: 'SET NULL' })
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

@Entity()
export class RazorpayPayment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  orderId: string;

  @Column({ type: 'varchar', nullable: true })
  paymentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  orderNumber: string;

  @Column({ type: 'float', default: 0 })
  discount: number;

  @Column({ type: 'float' })
  grandTotal: number;

  @OneToMany(() => OrderItem, oi => oi.order, {
    onDelete: 'CASCADE',
    eager: true,
  })
  orderItems: OrderItem[];

  @ManyToOne(() => User, u => u.id, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => OrderAddress, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'order_address_id' })
  orderAddress: OrderAddress;

  @OneToOne(() => BillingAddress, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'billing_address_id' })
  billingAddress: BillingAddress;

  @OneToOne(() => RazorpayPayment, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'razorpay_payment_id' })
  razorpayPayment: RazorpayPayment;

  @Column({
    type: 'varchar',
    enum: ORDER_STATUS_ENUM,
  })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  orderId: string;

  @Column({ type: 'varchar', enum: PAYMENT_GATEWAY })
  paymentGateway: string;

  @Column({ type: 'varchar', enum: PAYMENT_STATUS })
  paymentStatus: string;

  @Column({ type: 'float' })
  deliveryCharge: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, o => o.id, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductItem, p => p.id, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'product_item_id' })
  productItem: ProductItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
