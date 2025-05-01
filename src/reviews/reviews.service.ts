import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const newReview = await this.prisma.review.create({
        data: {
          ...createReviewDto,
        },
      });
      return responseHelper.success('Review created successfully', newReview);
    } catch (error) {
      return responseHelper.error('Failed to create review', error.message);
    }
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany({
      include: {
        media: {
          select: {
            thumbnail: true,
            alt: true,
          },
        },
      },
    });
    return responseHelper.success('All reviews', reviews);
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      include: {
        media: true,
      },
    });

    if (!review) {
      throw new NotFoundException(
        responseHelper.error(`Review with ID ${id} not found.`),
      );
    }
    return responseHelper.success('Review retrieved successfully', review);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(
        responseHelper.error(`Review with ID ${id} not found.`),
      );
    }
    const updatedReview = await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        ...updateReviewDto,
      },
    });
    return responseHelper.success('Review updated successfully', updatedReview);
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(
        responseHelper.error(`Review with ID ${id} not found.`),
      );
    }
    await this.prisma.review.delete({
      where: {
        id,
      },
    });
    return responseHelper.success('Review deleted successfully');
  }
}
