import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class CarouselsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCarouselDto: CreateCarouselDto) {
    const { title, description, link, subtitle, page } = createCarouselDto;
    try {
      const carousel = await this.prisma.carousel.create({
        data: {
          title,
          subtitle,
          description,
          link,
          media: {
            connect: {
              id: createCarouselDto.mediaId,
            },
          },
          page,
        },
      });
      return responseHelper.success('Carousel created successfully', carousel);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Carousel not created', error.message),
        400,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.carousel.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.carousel.count(),
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
    const carousels = await this.prisma.carousel.findMany({
      where: {
        page,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        media: true,
      },
    });
    if (!carousels.length) {
      throw new NotFoundException(responseHelper.error('No data found', null));
    }
    return responseHelper.success('All carousels', carousels);
  }
  async findOneById(id: number) {
    const carousel = await this.prisma.carousel.findUnique({
      where: {
        id,
      },
      include: {
        media: true,
      },
    });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }
    return responseHelper.success('Carousel found', carousel);
  }

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    const carousel = await this.prisma.carousel.findUnique({
      where: {
        id,
      },
    });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }

    const response = await this.prisma.carousel.update({
      where: {
        id,
      },
      data: {
        ...updateCarouselDto,
      },
    });
    return responseHelper.success('Carousel updated successfully', response);
  }

  async remove(id: number) {
    const carousel = await this.prisma.carousel.findUnique({
      where: {
        id,
      },
    });
    if (!carousel) {
      throw new NotFoundException(
        responseHelper.error('Carousel not found', null),
      );
    }
    const response = await this.prisma.carousel.delete({
      where: {
        id,
      },
    });
    return responseHelper.success('Carousel deleted successfully', response);
  }
}
