import { PrismaClient } from '@prisma/client';

const countries = [
  'United States', 'United Kingdom', 'Australia', 'Germany', 'France',
  'Japan', 'Canada', 'Netherlands', 'South Korea', 'Switzerland',
  'Sweden', 'Norway', 'Spain', 'Italy', 'Brazil',
];

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia',
  'James', 'Isabella', 'William', 'Mia', 'Benjamin',
  'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper',
];

const lastNames = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Miller',
  'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson',
];

const howHeard = [
  'Google Search', 'TripAdvisor', 'Instagram', 'Friend Recommendation',
  'Travel Blog', 'YouTube', 'Facebook', 'Lonely Planet',
];

const bookings = [
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    type: 'private',
    totalPrice: 900,
    price: 450,
    prePayment: 450,
    daysFromNow: 30,
    durationDays: 5,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    type: 'group',
    totalPrice: 1500,
    price: 750,
    prePayment: 750,
    daysFromNow: 45,
    durationDays: 10,
  },
  {
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: null,
    type: 'private',
    totalPrice: 1350,
    price: 1350,
    prePayment: 0,
    daysFromNow: 60,
    durationDays: 14,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    type: 'private',
    totalPrice: 550,
    price: 550,
    prePayment: 275,
    daysFromNow: 20,
    durationDays: 7,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    type: 'group',
    totalPrice: 2400,
    price: 1200,
    prePayment: 1200,
    daysFromNow: -10,
    durationDays: 15,
  },
  {
    status: 'cancelled',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    type: 'private',
    totalPrice: 400,
    price: 400,
    prePayment: 200,
    daysFromNow: -5,
    durationDays: 6,
    cancelReason: 'Change of travel plans due to family emergency',
    refundStatus: 'completed',
    refundAmount: 200,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    type: 'private',
    totalPrice: 3200,
    price: 1600,
    prePayment: 1600,
    daysFromNow: 75,
    durationDays: 12,
  },
  {
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: null,
    type: 'group',
    totalPrice: 4400,
    price: 2200,
    prePayment: 0,
    daysFromNow: 90,
    durationDays: 18,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    type: 'private',
    totalPrice: 900,
    price: 450,
    prePayment: 450,
    daysFromNow: 15,
    durationDays: 5,
  },
  {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    type: 'private',
    totalPrice: 2700,
    price: 1350,
    prePayment: 1350,
    daysFromNow: -30,
    durationDays: 14,
  },
];

export async function createBookings(
  prisma: PrismaClient,
  packageIds: number[],
): Promise<void> {
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const country = countries[i % countries.length];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + booking.daysFromNow);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + booking.durationDays);

    const tripCode = `PH-${2026}${String(i + 1).padStart(4, '0')}`;

    const createdBooking = await prisma.booking.create({
      data: {
        packageId: packageIds[i % packageIds.length],
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        country,
        phone: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
        emergency: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
        flightArrival: `TG ${311 + i} arriving KTM ${startDate.toISOString().slice(0, 10)} 14:30`,
        flightDeparture: `TG ${312 + i} departing KTM ${endDate.toISOString().slice(0, 10)} 10:15`,
        otherInformation: i % 3 === 0 ? 'Vegetarian diet preferred. Allergic to shellfish.' : null,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        tripCode,
        type: booking.type,
        totalPrice: booking.totalPrice,
        price: booking.price,
        prePayment: booking.prePayment,
        startDate,
        endDate,
        bookingDate: new Date(),
        howdidyouhear: howHeard[i % howHeard.length],
        cancelReason: (booking as any).cancelReason || null,
        cancelledAt: (booking as any).cancelReason ? new Date() : null,
        refundStatus: (booking as any).refundStatus || 'none',
        refundAmount: (booking as any).refundAmount || null,
      },
    });

    // Create payment record for paid bookings
    if (booking.paymentStatus === 'paid' && booking.paymentMethod) {
      await prisma.payment.create({
        data: {
          bookingId: createdBooking.id,
          status: 'completed',
          paymentMethod: booking.paymentMethod,
          amount: booking.prePayment,
          currency: 'USD',
          transactionId: `txn_${Date.now()}_${i}`,
          refundStatus: (booking as any).refundStatus || 'none',
          refundAmount: (booking as any).refundAmount || null,
        },
      });
    }
  }

  console.log(`  Created ${bookings.length} bookings with payments`);
}
