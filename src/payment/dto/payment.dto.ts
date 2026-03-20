import { IsInt, IsString, IsOptional, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @IsInt()
  @ApiProperty({ description: 'Booking ID' })
  bookingId: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Amount in cents (USD)' })
  amount: number;
}

export class CapturePaypalDto {
  @IsInt()
  @ApiProperty({ description: 'Booking ID' })
  bookingId: number;

  @IsString()
  @ApiProperty({ description: 'PayPal Order ID' })
  orderId: string;
}

export class CashPaymentDto {
  @IsInt()
  @ApiProperty({ description: 'Booking ID' })
  bookingId: number;
}

export class CancelBookingDto {
  @IsInt()
  @ApiProperty({ description: 'Booking ID' })
  bookingId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  reason?: string;
}

export class ProcessRefundDto {
  @IsInt()
  @ApiProperty({ description: 'Booking ID' })
  bookingId: number;

  @IsIn(['approved', 'rejected'])
  @ApiProperty({ enum: ['approved', 'rejected'] })
  action: 'approved' | 'rejected';

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Partial refund amount in cents' })
  refundAmount?: number;
}
