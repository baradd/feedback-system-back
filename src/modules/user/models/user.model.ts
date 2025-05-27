import { BaseModel } from 'src/common/crud/base.model';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity({
  name: 'users',
  orderBy: {
    createdAt: 'DESC',
  },
})
class UserModel extends BaseModel {
  @Column({ type: String, nullable: false })
  firstname: string;

  @Column({ type: String, nullable: false })
  lastname: string;

  @Column({ type: String, nullable: true })
  email?: string;

  @Column({ type: String, nullable: true })
  phone: string;

  @Column({ type: String, nullable: false })
  password: string;

  @Column({ type: String, nullable: true })
  image: string;

  @Column({ type: Boolean, nullable: false, default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deleted: boolean;
}

export { UserModel };
