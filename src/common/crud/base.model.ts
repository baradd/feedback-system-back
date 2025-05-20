import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({})
export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: Date, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: Date, nullable: false })
  updatedAt: Date;
}
