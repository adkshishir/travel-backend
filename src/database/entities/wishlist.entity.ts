import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Package } from './package.entity';

@Entity('wishlists')
@Unique(['userId', 'packageId'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  packageId: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Package, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
