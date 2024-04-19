import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Image extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ select: false, type: "varchar" })
  filename: string;

  @Column({ select: false, type: "varchar" })
  path: string;

  @Column({ type: "varchar" })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
