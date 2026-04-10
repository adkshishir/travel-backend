import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('SiteInformation')
export class SiteInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  logo: string;

  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  location: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone1: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone2: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  email1: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  email2: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  facebook: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  twitter: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  instagram: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  linkedin: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  youtube: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  whatsapp: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  openingTime: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  footerAbout: string;

  @Column({ type: 'mediumtext', nullable: true })
  embedVideo: string;
}
