import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity.js';
import { Image } from './image.entity.js';

@Entity()
export class Banner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  position: number;

  @ManyToOne(() => Image, i => i.id, { eager: true })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Category, p => p.id, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
