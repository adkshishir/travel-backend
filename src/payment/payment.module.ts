import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Booking } from 'src/database/entities/booking.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Booking, Payment])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
