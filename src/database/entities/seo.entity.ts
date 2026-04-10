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

@Entity('Seo')
export class Seo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  metaTitle: string;

  @Column({ type: 'mediumtext', nullable: true })
  metaDescription: string;

  @Column({ type: 'mediumtext', nullable: true })
  metaKeywords: string;

  @Column({ nullable: true })
  mediaId: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  metaCanonical: string;

  @Column({ type: 'mediumtext', nullable: true })
  schema: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true, unique: true })
  authorId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;
}
