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
import { Category } from './category.entity.ts';
import { Image } from './image.entity.ts';

@Entity()
export class Banner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
