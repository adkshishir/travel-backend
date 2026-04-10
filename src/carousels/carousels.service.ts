import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Carousel } from 'src/database/entities/carousel.entity';

@Injectable()
export class CarouselsService {
  constructor(
    @InjectRepository(Carousel)
    private readonly carouselRepo: Repository<Carousel>,
  ) {}

  async create(createCarouselDto: CreateCarouselDto) {
    const { title, description, link, subtitle, page } = createCarouselDto;
    try {
      const carousel = this.carouselRepo.create({
        title,
        subtitle,
        description,
        link,
        mediaId: createCarouselDto.mediaId,
        page,
      });
      await this.carouselRepo.save(carousel);
      return responseHelper.success('Carousel created successfully', carousel);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Carousel not created', (error as Error).message),
        400,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.carouselRepo.find({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.carouselRepo.count(),
    ]);

    if (!items.length) {
      throw new NotFoundException('No carousels found');
    }

    return responseHelper.success('All carousels', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findByPage(page: string) {
    const carousels = await this.carouselRepo.find({
      where: { page },
      relations: ['media'],
      order: { createdAt: 'DESC' },
    });
    if (!carousels.length) {
      throw new NotFoundException(responseHelper.error('No data found', null));
    }
    return responseHelper.success('All carousels', carousels);
  }

  async findOneById(id: number) {
    const carousel = await this.carouselRepo.findOne({
      where: { id },
      relations: ['media'],
    });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }
    return responseHelper.success('Carousel found', carousel);
  }

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    const carousel = await this.carouselRepo.findOne({ where: { id } });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }
    Object.assign(carousel, updateCarouselDto);
    const response = await this.carouselRepo.save(carousel);
    return responseHelper.success('Carousel updated successfully', response);
  }

  async remove(id: number) {
    const carousel = await this.carouselRepo.findOne({ where: { id } });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }
    await this.carouselRepo.remove(carousel);
    return responseHelper.success('Carousel deleted successfully', carousel);
  }
}
