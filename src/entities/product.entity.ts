import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity.js';
import { Category } from './category.entity.js';

@Entity()
export class ProductTag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar' })
  value: string;

  @OneToMany(() => OptionValue, ov => ov.option, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionId' })
  Options: OptionValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class OptionValue extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar' })
  value: string;

  @ManyToOne(
    () => Option,
    productVariationOption => productVariationOption.Options,
    { eager: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class ProductCofiguration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Option, option => option.id, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @ManyToOne(() => OptionValue, optionValue => optionValue.id, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionValueId' })
  optionValue: OptionValue;
}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  //add a cloumn with enum type
  @Column({
    type: 'enum',
    enum: ['published', 'draft'],
    default: 'published',
  })
  status: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToMany(() => ProductTag, { eager: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'product_productTag' })
  productTag: ProductTag[];

  @OneToMany(() => ProductItem, pi => pi.product, {
    onDelete: 'CASCADE',
  })
  productItems: ProductItem[];

  @ManyToOne(() => Category, c => c.id, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
@Unique(['product', 'productConfig'])
export class ProductItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ unique: true, type: 'varchar' })
  sku: string;

  @Column({ type: 'numeric' })
  stock: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => ProductCofiguration, pc => pc.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productConfigId' })
  productConfig?: ProductCofiguration;

  @ManyToMany(() => Image, { eager: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'productItem_image' })
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}