import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/database/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    const comment = this.commentRepo.create({
      name: dto.name,
      email: dto.email,
      message: dto.message,
      blogId: dto.blogId,
      packageId: dto.packageId,
      isApproved: false,
      isSpam: false,
    });
    await this.commentRepo.save(comment);
    return responseHelper.success('Comment submitted and awaiting moderation', comment);
  }

  async findApproved(blogId?: number, packageId?: number) {
    const qb = this.commentRepo
      .createQueryBuilder('c')
      .where('c.isApproved = :ap', { ap: true })
      .andWhere('c.isSpam = :sp', { sp: false })
      .orderBy('c.createdAt', 'DESC');
    if (blogId) qb.andWhere('c.blogId = :bid', { bid: blogId });
    if (packageId) qb.andWhere('c.packageId = :pid', { pid: packageId });

    const comments = await qb
      .select(['c.id', 'c.name', 'c.message', 'c.createdAt'])
      .getMany();
    return responseHelper.success('Approved comments fetched', comments);
  }

  async findAll(page = 1, limit = 10, filter?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, any> = {};
    if (filter === 'pending') {
      where.isApproved = false;
      where.isSpam = false;
    } else if (filter === 'approved') {
      where.isApproved = true;
    } else if (filter === 'spam') {
      where.isSpam = true;
    }

    const [items, total] = await Promise.all([
      this.commentRepo.find({
        where,
        relations: ['blog', 'package'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.commentRepo.count({ where }),
    ]);

    return responseHelper.success('Comments fetched successfully', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async approve(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }
    comment.isApproved = true;
    comment.isSpam = false;
    const updated = await this.commentRepo.save(comment);
    return responseHelper.success('Comment approved', updated);
  }

  async reject(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }
    comment.isApproved = false;
    const updated = await this.commentRepo.save(comment);
    return responseHelper.success('Comment rejected', updated);
  }

  async markSpam(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }
    comment.isSpam = true;
    comment.isApproved = false;
    const updated = await this.commentRepo.save(comment);
    return responseHelper.success('Comment marked as spam', updated);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }
    await this.commentRepo.remove(comment);
    return responseHelper.success('Comment deleted');
  }
}
