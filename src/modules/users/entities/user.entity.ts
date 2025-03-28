import { Token } from '@modules/auth/entities/token.entity';
import { UserRole } from '@modules/users/constans';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  public role: UserRole;

  @Column({ nullable: true })
  public phone?: string;

  @Column({ nullable: true })
  public address?: string;

  @Column({ nullable: true })
  public city?: string;

  @Column({ nullable: true })
  public state?: string;

  @Column({ nullable: true })
  public zip?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Token, ({ user }) => user)
  public tokens?: Token[];
}
