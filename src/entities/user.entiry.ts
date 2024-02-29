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
  OneToMany,
  Unique,
} from 'typeorm';
import { ProductItem } from './product.entity.js';
import { Image } from './image.entity.js';

@Entity()
export class Role extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: String;

  @Column({ name: 'name', unique: true, type: 'varchar' })
  name: String;

  @Column({ nullable: true, type: 'text' })
  description?: String;

  @Column({ default: true, type: 'boolean' })
  isVerified: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  bio: string;

  @OneToOne(() => Image, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

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

  @OneToOne(() => UserProfile, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'profile_id' })
  profile: UserProfile;

  @ManyToMany(() => Role, { eager: true, onDelete: 'NO ACTION' })
  @JoinTable()
  role: Role[];
}

@Entity()
export class UserCart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, p => p.cart, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  cardItems: CartItem[];
}

@Entity()
export class UserFavorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FavoriteItem, p => p.userFavorite, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  favoriteItems: FavoriteItem[];
}

@Entity()
export class FavoriteItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserFavorite, p => p.id, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'favorite_id' })
  userFavorite: UserFavorite;

  @OneToOne(() => ProductItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  productItem: ProductItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
@Unique(['cart', 'productItem'])
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserCart, cart => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart: UserCart;

  @ManyToOne(() => ProductItem, product => product.id, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  productItem: ProductItem;

  @Column({ type: 'int' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
