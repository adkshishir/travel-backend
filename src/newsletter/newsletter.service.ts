import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { Newsletter } from 'src/database/entities/newsletter.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private readonly newsletterRepo: Repository<Newsletter>,
  ) {}

  async subscribe(dto: CreateNewsletterDto) {
    const existing = await this.newsletterRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException(responseHelper.error('Email already subscribed'));
      }
      existing.isActive = true;
      if (dto.name !== undefined) existing.name = dto.name;
      const reactivated = await this.newsletterRepo.save(existing);
      return responseHelper.success('Successfully resubscribed to newsletter', reactivated);
    }
    const subscriber = this.newsletterRepo.create(dto);
    await this.newsletterRepo.save(subscriber);
    return responseHelper.success('Successfully subscribed to newsletter', subscriber);
  }

  async unsubscribe(email: string) {
    const existing = await this.newsletterRepo.findOne({ where: { email } });
    if (!existing) {
      return responseHelper.success('Email not found in subscription list');
    }
    await this.newsletterRepo.update({ email }, { isActive: false });
    return responseHelper.success('Successfully unsubscribed from newsletter');
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.newsletterRepo.find({
        where: { isActive: true },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.newsletterRepo.count({ where: { isActive: true } }),
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
    await this.newsletterRepo.delete({ id });
    return responseHelper.success('Subscriber deleted');
  }
}
