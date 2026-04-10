import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';

@Entity('Faq')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext', nullable: true })
  question: string;

  @Column({ type: 'mediumtext', nullable: true })
  answer: string;

  @Column({ nullable: true })
  packageId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Package, (p) => p.faqs, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
