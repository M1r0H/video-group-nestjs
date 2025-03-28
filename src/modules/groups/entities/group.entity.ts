import { Video } from '@modules/videos/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'groups' })
@Tree('closure-table')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description?: string;

  @TreeChildren()
  public children: Group[];

  @TreeParent()
  public parent?: Group | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Video, ({ group }) => group, { cascade: ['remove'] })
  public videos: Video[];
}
