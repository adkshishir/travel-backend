import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Media } from './media.entity';
import { Seo } from './seo.entity';

@Entity('Blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  title: string;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  page: string;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  authorId: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  publisher: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  isPublished: boolean;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Author, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  seo: Seo;
}
