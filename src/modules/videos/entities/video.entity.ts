import { Group } from '@modules/groups/entities/group.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public url: string;

  @Column({ nullable: true })
  public description?: string;

  @Column({ nullable: true })
  public groupId?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Group, ({ videos }) => videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  public group?: Group;
}
