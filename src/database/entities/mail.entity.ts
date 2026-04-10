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

@Entity('Mail')
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 191 })
  email: string;

  @Column({ type: 'mediumtext', nullable: true })
  message: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  Media: Media;
}
