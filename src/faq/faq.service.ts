import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Faq } from 'src/database/entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepo.create({
      question: createFaqDto.question,
      answer: createFaqDto.answer,
    });
    await this.faqRepo.save(faq);
    return responseHelper.success('Faq created successfully', faq);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = { packageId: IsNull() };

    const [items, total] = await Promise.all([
      this.faqRepo.find({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.faqRepo.count({ where }),
    ]);

    if (!items.length) {
      throw new NotFoundException(responseHelper.error('No data found', null));
    }

    return responseHelper.success('All faqs', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: number) {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    return responseHelper.success('Faq found', faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    faq.question = updateFaqDto.question;
    faq.answer = updateFaqDto.answer;
    const response = await this.faqRepo.save(faq);
    return responseHelper.success('Faq updated successfully', response);
  }

  async remove(id: number) {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    await this.faqRepo.remove(faq);
    return responseHelper.success('Faq deleted successfully', faq);
  }
}
