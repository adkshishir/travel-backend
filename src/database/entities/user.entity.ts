import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 191, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone: string;

  @Column({ type: 'boolean', nullable: true })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 191, nullable: true })
  otp: string;

  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
