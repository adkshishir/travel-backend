import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFaqDto: CreateFaqDto) {
    const faq = await this.prisma.faq.create({
      data: {
        question: createFaqDto.question,
        answer: createFaqDto.answer,
      },
    });
    return responseHelper.success('Faq created successfully', faq);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = { packageId: null };

    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({
        skip,
        take: limit,
        // find that doesnot have packageId
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.faq.count({ where }),
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
    const faq = await this.prisma.faq.findUnique({
      where: {
        id: id,
      },
    });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    return responseHelper.success('Faq found', faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.prisma.faq.findUnique({
      where: {
        id: id,
      },
    });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    const response = await this.prisma.faq.update({
      where: {
        id: id,
      },
      data: {
        question: updateFaqDto.question,
        answer: updateFaqDto.answer,
      },
    });
    return responseHelper.success('Faq updated successfully', response);
  }

  async remove(id: number) {
    const faq = await this.prisma.faq.findUnique({
      where: {
        id: id,
      },
    });
    if (!faq) {
      throw new NotFoundException(responseHelper.error('Faq not found', null));
    }
    const response = await this.prisma.faq.delete({
      where: {
        id: id,
      },
    });
    return responseHelper.success('Faq deleted successfully', response);
  }
}
