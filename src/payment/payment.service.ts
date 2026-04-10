import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import responseHelper from 'src/utils/response-helper';
import { Booking } from 'src/database/entities/booking.entity';
import { Payment } from 'src/database/entities/payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private paypalBaseUrl: string;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-02-25.clover',
    });
    this.paypalBaseUrl =
      process.env.PAYPAL_MODE === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
  }

  private async upsertPayment(
    bookingId: number,
    createData: {
      status: string;
      paymentMethod: string;
      amount: number;
      currency: string;
      transactionId: string;
    },
    updateData: Partial<Pick<Payment, 'status' | 'transactionId' | 'updatedAt'>>,
  ) {
    let row = await this.paymentRepo.findOne({ where: { bookingId } });
    if (!row) {
      row = this.paymentRepo.create({
        id: randomUUID(),
        bookingId,
        ...createData,
      });
    } else {
      Object.assign(row, updateData);
    }
    await this.paymentRepo.save(row);
  }

  async createStripeIntent(bookingId: number, amount: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['package'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const intent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: {
        bookingId: bookingId.toString(),
        packageTitle: booking.package?.title || '',
        customerName: booking.name || '',
      },
    });

    await this.bookingRepo.update(
      { id: bookingId },
      { paymentMethod: 'stripe' },
    );

    return responseHelper.success('Payment intent created', {
      clientSecret: intent.client_secret,
      intentId: intent.id,
    });
  }

  async confirmStripePayment(paymentIntentId: string) {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const bookingId = parseInt(intent.metadata.bookingId, 10);

    if (intent.status === 'succeeded') {
      await this.upsertPayment(
        bookingId,
        {
          status: 'paid',
          paymentMethod: 'stripe',
          amount: Math.round(intent.amount / 100),
          currency: intent.currency.toUpperCase(),
          transactionId: paymentIntentId,
        },
        {
          status: 'paid',
          transactionId: paymentIntentId,
          updatedAt: new Date(),
        },
      );

      await this.bookingRepo.update(
        { id: bookingId },
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentMethod: 'stripe',
          totalPrice: Math.round(intent.amount / 100),
        },
      );

      return responseHelper.success('Payment confirmed', { bookingId });
    }

    throw new BadRequestException('Payment not completed');
  }

  async stripeWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.confirmStripePayment(intent.id).catch(() => {});
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingId = parseInt(intent.metadata.bookingId, 10);
      await this.bookingRepo
        .update({ id: bookingId }, { paymentStatus: 'failed' })
        .catch(() => {});
    }

    return { received: true };
  }

  private async getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const secret = process.env.PAYPAL_CLIENT_SECRET || '';
    const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const res = await fetch(`${this.paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = (await res.json()) as any;
    if (!data.access_token) throw new InternalServerErrorException('PayPal auth failed');
    return data.access_token;
  }

  async createPayPalOrder(bookingId: number, amount: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['package'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const token = await this.getPayPalAccessToken();
    const res = await fetch(`${this.paypalBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: bookingId.toString(),
            amount: { currency_code: 'USD', value: amount.toFixed(2) },
            description: booking.package?.title || 'Trek Package',
          },
        ],
        application_context: {
          brand_name: 'Poonhill Treks',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const order = (await res.json()) as any;
    if (!order.id) throw new InternalServerErrorException('PayPal order creation failed');

    await this.bookingRepo.update(
      { id: bookingId },
      { paymentMethod: 'paypal' },
    );

    return responseHelper.success('PayPal order created', {
      orderId: order.id,
      approvalUrl: order.links?.find((l: any) => l.rel === 'approve')?.href,
    });
  }

  async capturePayPalOrder(bookingId: number, orderId: string) {
    const token = await this.getPayPalAccessToken();
    const res = await fetch(
      `${this.paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const capture = (await res.json()) as any;
    if (capture.status !== 'COMPLETED') {
      throw new BadRequestException('PayPal payment not completed');
    }

    const unit = capture.purchase_units?.[0];
    const captureDetail = unit?.payments?.captures?.[0];
    const amount = parseFloat(captureDetail?.amount?.value || '0');

    await this.upsertPayment(
      bookingId,
      {
        status: 'paid',
        paymentMethod: 'paypal',
        amount: Math.round(amount),
        currency: 'USD',
        transactionId: captureDetail?.id || orderId,
      },
      {
        status: 'paid',
        transactionId: captureDetail?.id || orderId,
        updatedAt: new Date(),
      },
    );

    await this.bookingRepo.update(
      { id: bookingId },
      {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentMethod: 'paypal',
        totalPrice: Math.round(amount),
      },
    );

    return responseHelper.success('PayPal payment captured', { bookingId });
  }

  async registerCashPayment(bookingId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingRepo.update(
      { id: bookingId },
      {
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        status: 'confirmed',
      },
    );

    return responseHelper.success('Cash payment registered. Payment due on arrival.', {
      bookingId,
    });
  }

  async cancelBooking(bookingId: number, reason?: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['payment'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updateData: Partial<Booking> = {
      status: 'cancelled',
      cancelReason: reason || null,
      cancelledAt: new Date(),
    };

    if (booking.paymentStatus === 'paid' && booking.payment) {
      updateData.refundStatus = 'requested';
    }

    await this.bookingRepo.update({ id: bookingId }, updateData);
    const updated = await this.bookingRepo.findOne({ where: { id: bookingId } });

    return responseHelper.success(
      booking.paymentStatus === 'paid'
        ? 'Booking cancelled. Refund request submitted — admin will process it shortly.'
        : 'Booking cancelled successfully.',
      updated,
    );
  }

  async processRefund(
    bookingId: number,
    action: 'approved' | 'rejected',
    refundAmount?: number,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['payment'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.refundStatus !== 'requested') {
      throw new BadRequestException('No refund requested for this booking');
    }

    if (action === 'rejected') {
      await this.bookingRepo.update({ id: bookingId }, { refundStatus: 'rejected' });
      return responseHelper.success('Refund request rejected', {});
    }

    const amount = refundAmount || booking.payment?.amount || booking.totalPrice || 0;
    const payment = booking.payment;

    try {
      if (payment?.paymentMethod === 'stripe' && payment.transactionId) {
        const refund = await this.stripe.refunds.create({
          payment_intent: payment.transactionId,
          amount: amount * 100,
        });

        const payRow = await this.paymentRepo.findOne({ where: { bookingId } });
        if (payRow) {
          payRow.refundId = refund.id;
          payRow.refundedAt = new Date();
          payRow.refundStatus = 'completed';
          payRow.refundAmount = amount;
          payRow.updatedAt = new Date();
          await this.paymentRepo.save(payRow);
        }
      } else if (payment?.paymentMethod === 'paypal' && payment.transactionId) {
        const token = await this.getPayPalAccessToken();
        const res = await fetch(
          `${this.paypalBaseUrl}/v2/payments/captures/${payment.transactionId}/refund`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: { value: amount.toFixed(2), currency_code: 'USD' },
            }),
          },
        );
        const refundData = (await res.json()) as any;

        const payRow = await this.paymentRepo.findOne({ where: { bookingId } });
        if (payRow) {
          payRow.refundId = refundData.id;
          payRow.refundedAt = new Date();
          payRow.refundStatus = 'completed';
          payRow.refundAmount = amount;
          payRow.updatedAt = new Date();
          await this.paymentRepo.save(payRow);
        }
      }

      await this.bookingRepo.update(
        { id: bookingId },
        {
          refundStatus: 'completed',
          refundAmount: amount,
        },
      );

      return responseHelper.success('Refund processed successfully', { bookingId, amount });
    } catch (err) {
      await this.bookingRepo.update({ id: bookingId }, { refundStatus: 'failed' });
      throw new InternalServerErrorException(
        'Refund processing failed: ' + (err as Error).message,
      );
    }
  }

  async getPaymentStatus(bookingId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['payment'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return responseHelper.success('Payment status retrieved', {
      bookingId,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      refundStatus: booking.refundStatus,
      refundAmount: booking.refundAmount,
      payment: booking.payment,
    });
  }
}
