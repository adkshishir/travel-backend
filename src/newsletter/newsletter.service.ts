import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: CreateNewsletterDto) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException(responseHelper.error('Email already subscribed'));
      }
      const reactivated = await this.prisma.newsletter.update({
        where: { email: dto.email },
        data: { isActive: true, name: dto.name ?? existing.name },
      });
      return responseHelper.success('Successfully resubscribed to newsletter', reactivated);
    }
    const subscriber = await this.prisma.newsletter.create({ data: dto });
    return responseHelper.success('Successfully subscribed to newsletter', subscriber);
  }

  async unsubscribe(email: string) {
    const existing = await this.prisma.newsletter.findUnique({ where: { email } });
    if (!existing) {
      return responseHelper.success('Email not found in subscription list');
    }
    await this.prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });
    return responseHelper.success('Successfully unsubscribed from newsletter');
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.newsletter.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.newsletter.count({ where: { isActive: true } }),
    ]);
    return responseHelper.success('Subscribers fetched', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async remove(id: number) {
    await this.prisma.newsletter.delete({ where: { id } });
    return responseHelper.success('Subscriber deleted');
  }
}
