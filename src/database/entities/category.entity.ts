import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Seo } from './seo.entity';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, unique: true })
  endpoint: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  slug: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  seo: Seo;
}
