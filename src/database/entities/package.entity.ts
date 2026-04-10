import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Destination } from './destination.entity';
import { Media } from './media.entity';
import { Seo } from './seo.entity';
import { Review } from './review.entity';
import { Faq } from './faq.entity';
import { Booking } from './booking.entity';

@Entity('Package')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  title: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  accommodation: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  startFrom: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  endAt: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  duration: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  altitude: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  bestSeason: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  price: string;

  @Column({ type: 'mediumtext', nullable: true })
  videoLink: string;

  @Column({ type: 'int', nullable: true, default: 5 })
  rating: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  culture: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  attractions: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  groupSize: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  groupAge: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  nature: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  activity: string;

  @Column({ type: 'longtext', nullable: true })
  overview: string;

  @Column({ type: 'longtext', nullable: true })
  itinerary: string;

  @Column({ type: 'longtext', nullable: true })
  includes: string;

  @Column({ type: 'longtext', nullable: true })
  goodtoknow: string;

  @Column({ type: 'longtext', nullable: true })
  highlights: string;

  @Column({ nullable: true })
  mapId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true, unique: true })
  seoId: number;

  @Column()
  destinationId: number;

  @Column({ nullable: true })
  mainImageId: number;

  @ManyToOne(() => Destination, (d) => d.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'destinationId' })
  destination: Destination;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mainImageId' })
  mainImage: Media;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mapId' })
  map: Media;

  @OneToOne(() => Seo, { nullable: true })
  @JoinColumn({ name: 'seoId' })
  seo: Seo;

  @ManyToMany(() => Media)
  @JoinTable({
    name: '_mediaPackages',
    joinColumn: { name: 'B', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'A', referencedColumnName: 'id' },
  })
  media: Media[];

  @OneToMany(() => Review, (r) => r.package)
  reviews: Review[];

  @OneToMany(() => Faq, (f) => f.package)
  faqs: Faq[];

  @OneToMany(() => Booking, (b) => b.package)
  Booking: Booking[];
}
