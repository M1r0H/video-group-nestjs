import { User } from '@modules/users/entities/user.entity';
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

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public token: string;

  @Column()
  public type: string;

  @Column({ nullable: true })
  public payload: string;

  @Column({ nullable: true })
  public expiresAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: true })
  public userId: string;

  @ManyToOne(() => User, ({ tokens }) => tokens)
  @JoinColumn({ name: 'userId' })
  public user: User;
}
