import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: String;

  @Column({ name: 'name', unique: true, type: 'varchar' })
  name: String;

  @Column({ nullable: true, type: 'text' })
  description?: String;

  @Column({ default: false, type: 'boolean' })
  isVerified: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
