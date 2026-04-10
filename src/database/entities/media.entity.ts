import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  alt: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  original: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  thumbnail: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  type: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  packageId: number;
}
