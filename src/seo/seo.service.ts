import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSeoDto: CreateSeoDto) {
    const seo = await this.prisma.seo.create({ data: createSeoDto });
    return responseHelper.success('SEO record created', seo);
  }

  async findAll() {
    const items = await this.prisma.seo.findMany({
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return responseHelper.success('SEO records fetched', items);
  }

  async findOne(id: number) {
    const seo = await this.prisma.seo.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    return responseHelper.success('SEO record fetched', seo);
  }

  async update(id: number, updateSeoDto: UpdateSeoDto) {
    const seo = await this.prisma.seo.findUnique({ where: { id } });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    const updated = await this.prisma.seo.update({ where: { id }, data: updateSeoDto });
    return responseHelper.success('SEO record updated', updated);
  }

  async remove(id: number) {
    const seo = await this.prisma.seo.findUnique({ where: { id } });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    await this.prisma.seo.delete({ where: { id } });
    return responseHelper.success('SEO record deleted');
  }
}
