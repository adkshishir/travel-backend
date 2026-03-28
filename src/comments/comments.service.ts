import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
        blogId: dto.blogId,
        packageId: dto.packageId,
        isApproved: false,
        isSpam: false,
      },
    });
    return responseHelper.success('Comment submitted and awaiting moderation', comment);
  }

  async findApproved(blogId?: number, packageId?: number) {
    const where: any = { isApproved: true, isSpam: false };
    if (blogId) where.blogId = blogId;
    if (packageId) where.packageId = packageId;

    const comments = await this.prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, message: true, createdAt: true },
    });
    return responseHelper.success('Approved comments fetched', comments);
  }

  async findAll(page = 1, limit = 10, filter?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filter === 'pending') {
      where.isApproved = false;
      where.isSpam = false;
    } else if (filter === 'approved') {
      where.isApproved = true;
    } else if (filter === 'spam') {
      where.isSpam = true;
    }

    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          blog: { select: { id: true, title: true, slug: true } },
          package: { select: { id: true, title: true, slug: true } },
        },
      }),
      this.prisma.comment.count({ where }),
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
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: { isApproved: true, isSpam: false },
    });

    return responseHelper.success('Comment approved', updated);
  }

  async reject(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: { isApproved: false },
    });

    return responseHelper.success('Comment rejected', updated);
  }

  async markSpam(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: { isSpam: true, isApproved: false },
    });

    return responseHelper.success('Comment marked as spam', updated);
  }

  async remove(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(responseHelper.error('Comment not found'));
    }

    await this.prisma.comment.delete({ where: { id } });
    return responseHelper.success('Comment deleted');
  }
}
