import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Destination } from './destination.entity';
import { Media } from './media.entity';
import { Seo } from './seo.entity';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  slug: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  seo: Seo;

  @OneToMany(() => Destination, (d) => d.activity)
  destinations: Destination[];
}
