import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentIntentDto,
  CapturePaypalDto,
  CashPaymentDto,
  CancelBookingDto,
  ProcessRefundDto,
} from './dto/payment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Payment')
@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ── Stripe ─────────────────────────────────────────────────────────

  @Post('stripe/create-intent')
  createStripeIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createStripeIntent(dto.bookingId, dto.amount);
  }

  @Post('stripe/confirm')
  confirmStripe(@Body() body: { paymentIntentId: string }) {
    return this.paymentService.confirmStripePayment(body.paymentIntentId);
  }

  @Post('stripe/webhook')
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    return this.paymentService.stripeWebhook(req.rawBody!, sig);
  }

  // ── PayPal ─────────────────────────────────────────────────────────

  @Post('paypal/create-order')
  createPayPalOrder(@Body() body: { bookingId: number; amount: number }) {
    return this.paymentService.createPayPalOrder(body.bookingId, body.amount);
  }

  @Post('paypal/capture')
  capturePayPal(@Body() dto: CapturePaypalDto) {
    return this.paymentService.capturePayPalOrder(dto.bookingId, dto.orderId);
  }

  // ── Cash ───────────────────────────────────────────────────────────

  @Post('cash')
  cashPayment(@Body() dto: CashPaymentDto) {
    return this.paymentService.registerCashPayment(dto.bookingId);
  }

  // ── Cancel ─────────────────────────────────────────────────────────

  @Post('cancel')
  cancelBooking(@Body() dto: CancelBookingDto) {
    return this.paymentService.cancelBooking(dto.bookingId, dto.reason);
  }

  // ── Admin Refund ───────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('refund')
  processRefund(@Body() dto: ProcessRefundDto) {
    return this.paymentService.processRefund(dto.bookingId, dto.action, dto.refundAmount);
  }

  // ── Status ─────────────────────────────────────────────────────────

  @Get('status/:bookingId')
  getStatus(@Param('bookingId') id: string) {
    return this.paymentService.getPaymentStatus(+id);
  }
}
