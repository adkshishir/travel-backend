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
import { Activity } from './activity.entity';
import { Media } from './media.entity';
import { Seo } from './seo.entity';
import { Package } from './package.entity';

@Entity('Destination')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  slug: string;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column()
  activityId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @Column({ nullable: true })
  mediaId: number;

  @ManyToOne(() => Activity, (a) => a.destinations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  seo: Seo;

  @OneToMany(() => Package, (p) => p.destination)
  packages: Package[];
}
