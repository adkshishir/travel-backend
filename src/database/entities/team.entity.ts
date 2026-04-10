import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('Team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  facebook: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  twitter: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  linkedin: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  Media: Media;
}
