import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Package } from './package.entity';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191 })
  email: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isApproved: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isSpam: boolean;

  @Column({ type: 'mediumtext', nullable: true })
  message: string;

  @Column({ nullable: true })
  packageId: number;

  @Column({ nullable: true })
  blogId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Blog, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @ManyToOne(() => Package, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
