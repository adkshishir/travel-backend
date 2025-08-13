import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exist = await this.prisma.category.findUnique({
      where: {
        endpoint: createCategoryDto.endpoint,
      },
    });
    if (exist) {
      throw new NotFoundException(
        responseHelper.error('Category with this endpoint already exists', null),
      );
    }

    try {
      const category = await this.prisma.category.create({
        data: {
          endpoint: createCategoryDto.endpoint,
          content: createCategoryDto.content,
          title: createCategoryDto.title,
          slug: createCategoryDto.slug || createCategoryDto.endpoint,
          isActive: createCategoryDto.isActive ?? true,
          seo: createCategoryDto.seo ? {
            create: {
              ...createCategoryDto.seo,
              mediaId: createCategoryDto.seo?.mediaId || undefined,
            },
          } : undefined,
        },
        include: {
          seo: {
            include: {
              media: true,
            },
          },
        },
      });
      return responseHelper.success('Category created successfully', category);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not created', error.message),
        400,
      );
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        seo: {
          include: {
            media: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return responseHelper.success('All categories', categories);
  }

  async findOne(identifier: string) {
    // Try to find by endpoint first, then by slug
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [
          { endpoint: identifier },
          { slug: identifier },
        ],
        isActive: true,
      },
      include: {
        seo: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    return responseHelper.success('Category found', category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const exist = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!exist) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    // Check if endpoint is being updated and if it conflicts with existing
    if (updateCategoryDto.endpoint && updateCategoryDto.endpoint !== exist.endpoint) {
      const endpointExists = await this.prisma.category.findUnique({
        where: { endpoint: updateCategoryDto.endpoint },
      });
      if (endpointExists) {
        throw new HttpException(
          responseHelper.error('Category with this endpoint already exists', null),
          400,
        );
      }
    }

    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          endpoint: updateCategoryDto.endpoint,
          content: updateCategoryDto.content,
          title: updateCategoryDto.title,
          slug: updateCategoryDto.slug,
          isActive: updateCategoryDto.isActive,
          seo: updateCategoryDto.seo ? {
            upsert: {
              create: {
                ...updateCategoryDto.seo,
                mediaId: updateCategoryDto.seo?.mediaId || undefined,
              },
              update: {
                ...updateCategoryDto.seo,
                mediaId: updateCategoryDto.seo?.mediaId || undefined,
              },
            },
          } : undefined,
        },
        include: {
          seo: {
            include: {
              media: true,
            },
          },
        },
      });
      return responseHelper.success('Category updated successfully', category);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not updated', error.message),
        400,
      );
    }
  }

  async remove(id: number) {
    const exist = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!exist) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return responseHelper.success('Category deleted successfully', null);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not deleted', error.message),
        400,
      );
    }
  }
}
