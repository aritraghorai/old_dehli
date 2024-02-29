import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity.js';

@Entity()
@Tree('closure-table')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @TreeChildren()
  subCategories: Category[];

  @TreeParent()
  parent: Category;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Image, { eager: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'imageId' })
  image: Image;
}
