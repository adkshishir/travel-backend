import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create review', error.message),
      );
    }
  }

  async findAll() {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve reviews', error.message),
      );
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve review', error.message),
      );
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update review', error.message),
      );
    }
  }

  async remove(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete review', error.message),
      );
    }
  }
}
