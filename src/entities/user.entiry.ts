import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  BaseEntity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  AfterInsert,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity.js';
import { ProductItem } from './product.entity.js';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ nullable: true, type: 'varchar' })
  email?: string;

  @Column({ nullable: true, type: 'varchar' })
  password?: string;

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  role: Role[];
}

@Entity()
export class UserCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, p => p.cart, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: CartItem[];
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserCart, cart => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart: UserCart;

  @ManyToOne(() => ProductItem, product => product.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductItem;

  @Column({ type: 'int' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
