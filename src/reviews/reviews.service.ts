import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Review } from 'src/database/entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const newReview = this.reviewRepo.create(createReviewDto as any);
      await this.reviewRepo.save(newReview);
      return responseHelper.success('Review created successfully', newReview);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create review', (error as Error).message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.reviewRepo.find({
          skip,
          take: limit,
          relations: ['media'],
          order: { createdAt: 'DESC' },
        }),
        this.reviewRepo.count(),
      ]);

      return responseHelper.success('All reviews', {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve reviews', (error as Error).message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.reviewRepo.findOne({
        where: { id },
        relations: ['media'],
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
        responseHelper.error('Failed to retrieve review', (error as Error).message),
      );
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException(
          responseHelper.error(`Review with ID ${id} not found.`),
        );
      }
      Object.assign(review, updateReviewDto);
      const updatedReview = await this.reviewRepo.save(review);
      return responseHelper.success('Review updated successfully', updatedReview);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update review', (error as Error).message),
      );
    }
  }

  async remove(id: number) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException(
          responseHelper.error(`Review with ID ${id} not found.`),
        );
      }
      await this.reviewRepo.remove(review);
      return responseHelper.success('Review deleted successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete review', (error as Error).message),
      );
    }
  }
}
