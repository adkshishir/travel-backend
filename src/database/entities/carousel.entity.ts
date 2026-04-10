import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('Carousel')
export class Carousel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  title: string;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  page: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;
}
