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
import { Package } from './package.entity';

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  title: string;

  @Column({ type: 'int', nullable: true, default: 5 })
  rating: number;

  @Column({ nullable: true })
  packageId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @ManyToOne(() => Package, (p) => p.reviews, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
