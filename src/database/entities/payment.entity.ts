import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Media } from './media.entity';

@Entity('payment')
export class Payment {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ unique: true })
  bookingId: number;

  @Column({ type: 'varchar', length: 191 })
  status: string;

  @Column({ type: 'varchar', length: 191 })
  paymentMethod: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 191, nullable: true, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  transactionId: string;

  @Column({ type: 'int', nullable: true })
  discountAmount: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  discountType: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  couponCode: string;

  @Column({ name: 'payment_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ type: 'varchar', length: 191, nullable: true })
  refundId: string;

  @Column({ type: 'datetime', nullable: true })
  refundedAt: Date;

  @Column({ type: 'varchar', length: 191, nullable: true, default: 'none' })
  refundStatus: string;

  @Column({ type: 'int', nullable: true })
  refundAmount: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  failureReason: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  mediaId: number;

  @OneToOne(() => Booking, (b) => b.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  Media: Media;
}
