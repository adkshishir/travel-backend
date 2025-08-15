import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}
  async create(createActivityDto: CreateActivityDto) {
    const exist = await this.prisma.activity.findUnique({
      where: {
        slug: createActivityDto.slug,
      },
    });
    if (exist) {
      throw new NotFoundException(
        responseHelper.error('Activity already exist', null),
      );
    }

    try {
      const activity = await this.prisma.activity.create({
        data: {
          name: createActivityDto.name,
          description: createActivityDto.description,
          slug: createActivityDto.slug,
          media: {
            connect: createActivityDto.mediaId
              ? {
                  id: createActivityDto.mediaId || undefined,
                }
              : undefined,
          },
          seo: {
            create: {
              ...createActivityDto.seo,
              mediaId: createActivityDto.seo?.mediaId || undefined,
            },
          },
        },
        include: {
          seo: {
            include: {
              media: true,
            },
          },
          media: true,
        },
      });
      return responseHelper.success('Activity created', activity);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Activity not created', error.message),
        400,
      );
    }
  }

  async navItems() {
    const activities = await this.prisma.activity.findMany({
      select: {
        name: true,
        slug: true,
        destinations: {
          select: {
            name: true,
            slug: true,
            packages: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    return responseHelper.success('All activities', activities);
  }

  async findAll() {
    const activities = await this.prisma.activity.findMany({
      // for update activites seos
      include: {
        _count: true,
        media: {
          select: {
            thumbnail: true,
            alt: true,
          },
        },
      },
    });
    return responseHelper.success('All activities', activities);
  }

  async findOne(slug: string) {
    const activity = await this.prisma.activity.findUnique({
      where: {
        slug,
      },
      include: {
        seo: {
          select: {
            metaTitle: true,
            metaCanonical: true,
            metaDescription: true,
            metaKeywords: true,
            schema: true,
            media: {
              select: {
                thumbnail: true,
                id: true,
                alt: true,
              },
            },
          },
        },
        media: true,
        destinations: {
          select: {
            name: true,
            slug: true,

            media: {
              select: {
                thumbnail: true,
              },
            },
          },
        },
      },
    });
    if (!activity) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    return responseHelper.success('Activity found', activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    const old = await this.prisma.activity.findUnique({
      where: {
        id,
      },
    });
    if (!old) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    const activity = await this.prisma.activity.update({
      where: { id },
      data: {
        name: updateActivityDto.name,
        description: updateActivityDto.description,
        slug: updateActivityDto.slug,
        media: {
          connect: updateActivityDto.mediaId
            ? {
                id: updateActivityDto.mediaId || undefined,
              }
            : undefined,
        },
        seo: {
          update: {
            ...updateActivityDto.seo,
            mediaId: updateActivityDto.seo?.mediaId || undefined,
          },
        },
      },
      include: {
        seo: {
          include: {
            media: true,
          },
        },
        media: true,
      },
    });
    return responseHelper.success('Activity updated successfully', activity);
  }

  async remove(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id,
      },
    });
    if (!activity) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    const response = await this.prisma.activity.delete({
      where: {
        id,
      },
    });
    return responseHelper.success('Activity deleted successfully', response);
  }
}
