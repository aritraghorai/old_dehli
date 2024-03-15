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
    onDelete: 'NO ACTION',
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
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'optionId' })
  option: Option;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
@Unique(['name'])
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Image, { eager: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'restruent_image' })
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class ProductType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Image, { eager: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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

  @ManyToOne(() => Shop, s => s.id, { eager: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ type: 'float' })
  price: number;

  @ManyToMany(() => ProductTag, { eager: true, onDelete: 'NO ACTION' })
  @JoinTable({ name: 'product_productTag' })
  productTag: ProductTag[];

  @OneToMany(() => ProductItem, pi => pi.product, {
    onDelete: 'CASCADE',
  })
  productItems: ProductItem[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => ProductType, pt => pt.id, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'productTypeId' })
  type: ProductType;

  @ManyToOne(() => Category, c => c.id, { eager: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
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

  @OneToMany(() => ProductCofiguration, pc => pc.productItem, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  productConfig?: ProductCofiguration[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Image, { eager: true, onDelete: 'NO ACTION' })
  @JoinTable({ name: 'productItem_image' })
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
@Unique(['productItem', 'optionValue', 'option'])
export class ProductCofiguration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductItem, productItem => productItem.id, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'productItemId' })
  productItem: ProductItem;

  @ManyToOne(() => OptionValue, optionValue => optionValue.id, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'optionValueId' })
  optionValue: OptionValue;

  @ManyToOne(() => Option, option => option.id, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'optionId' })
  option: Option;
}
