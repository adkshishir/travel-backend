import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { Payment } from './payment.entity';

@Entity('Booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column()
  packageId: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  emergency: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  flightArrival: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  flightDeparture: string;

  @Column({ type: 'mediumtext', nullable: true })
  otherInformation: string;

  @Column({ type: 'varchar', length: 191, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 191, default: 'unpaid' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  tripCode: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  type: string;

  @Column({ type: 'int', nullable: true })
  totalPrice: number;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  extraPrice: number;

  @Column({ type: 'int', nullable: true })
  extraDays: number;

  @Column({ type: 'int', nullable: true })
  extraNights: number;

  @Column({ type: 'datetime', nullable: true })
  bookingDate: Date;

  @Column({ type: 'varchar', length: 191, nullable: true })
  howdidyouhear: string;

  @Column({ type: 'float', nullable: true })
  prePayment: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  cancelReason: string;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'varchar', length: 191, nullable: true, default: 'none' })
  refundStatus: string;

  @Column({ type: 'int', nullable: true })
  refundAmount: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Package, (p) => p.Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @OneToOne(() => Payment, (pay) => pay.booking)
  payment: Payment;
}
