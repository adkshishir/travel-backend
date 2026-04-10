import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { Seo } from 'src/database/entities/seo.entity';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
  ) {}

  async create(createSeoDto: CreateSeoDto) {
    const seo = this.seoRepo.create(createSeoDto as any);
    await this.seoRepo.save(seo);
    return responseHelper.success('SEO record created', seo);
  }

  async findAll() {
    const items = await this.seoRepo.find({
      relations: ['media'],
      order: { createdAt: 'DESC' },
    });
    return responseHelper.success('SEO records fetched', items);
  }

  async findOne(id: number) {
    const seo = await this.seoRepo.findOne({
      where: { id },
      relations: ['media'],
    });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    return responseHelper.success('SEO record fetched', seo);
  }

  async update(id: number, updateSeoDto: UpdateSeoDto) {
    const seo = await this.seoRepo.findOne({ where: { id } });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    Object.assign(seo, updateSeoDto);
    const updated = await this.seoRepo.save(seo);
    return responseHelper.success('SEO record updated', updated);
  }

  async remove(id: number) {
    const seo = await this.seoRepo.findOne({ where: { id } });
    if (!seo) throw new NotFoundException(responseHelper.error('SEO record not found'));
    await this.seoRepo.remove(seo);
    return responseHelper.success('SEO record deleted');
  }
}
