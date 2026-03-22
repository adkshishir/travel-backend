import { PrismaClient } from '@prisma/client';

export async function createUsers(prisma: PrismaClient): Promise<number[]> {
  const users = [
    {
      name: 'Shishir Adhikari',
      email: process.env.ADMIN_EMAIL || 'adhikarishishir50@gmail.com',
      role: 'ADMIN' as const,
      country: 'Nepal',
      phone: '+977-9856012345',
      isVerified: true,
    },
    {
      name: 'Anita Gurung',
      email: 'anita@poonhilltreks.com',
      role: 'AUTHOR' as const,
      country: 'Nepal',
      phone: '+977-9841234567',
      isVerified: true,
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      role: 'USER' as const,
      country: 'United States',
      phone: '+1-415-555-0123',
      isVerified: true,
    },
    {
      name: 'James Thornton',
      email: 'james.thornton@email.co.uk',
      role: 'USER' as const,
      country: 'United Kingdom',
      phone: '+44-7911-555123',
      isVerified: true,
    },
    {
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@email.jp',
      role: 'USER' as const,
      country: 'Japan',
      phone: '+81-90-1234-5678',
      isVerified: true,
    },
    {
      name: 'Marcus Weber',
      email: 'marcus.weber@email.de',
      role: 'USER' as const,
      country: 'Germany',
      phone: '+49-170-1234567',
      isVerified: false,
    },
  ];

  const ids: number[] = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    ids.push(created.id);
  }

  console.log(`  Created ${ids.length} users`);
  return ids;
}
