import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Media } from './media.entity';
import { Seo } from './seo.entity';

@Entity('Author')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'varchar', length: 191 })
  username: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  email: string;

  @Column({ type: 'mediumtext', nullable: true })
  bio: string;

  @Column({ type: 'json', nullable: true })
  socialLinks: Record<string, unknown>;

  @Column({ type: 'varchar', length: 191, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 191, default: 'author' })
  role: string;

  @Column({ type: 'varchar', length: 191, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  Seo: Seo;

  @OneToMany(() => Blog, (b) => b.author)
  blogs: Blog[];
}
