import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

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

  async findAll() {
    const faqs = await this.prisma.faq.findMany({
      // find that doesnot have packageId
      where: {
        packageId: null,
      },
    });
    if (!faqs.length) {
      throw new NotFoundException(responseHelper.error('No data found', null));
    }
    return responseHelper.success('All faqs', faqs);
  }

  findOne(id: number) {
    return `This action returns a #${id} faq`;
  }

  update(id: number, updateFaqDto: UpdateFaqDto) {
    return `This action updates a #${id} faq`;
  }

  remove(id: number) {
    return `This action removes a #${id} faq`;
  }
}
