import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}
  async create(createDestinationDto: CreateDestinationDto) {
    const existDestination = await this.prisma.destination.findUnique({
      where: {
        slug: createDestinationDto.slug,
      },
    });
    if (existDestination) {
      throw new BadRequestException(
        responseHelper.error('Destination already exist', {
          slug: ['Destination already exist'],
        }),
      );
    }
    try {
      const destination = await this.prisma.destination.create({
        data: {
          name: createDestinationDto.name,
          description: createDestinationDto.description,
          slug: createDestinationDto.slug,
          media: {
            connect: createDestinationDto.mediaId
              ? {
                  id: createDestinationDto.mediaId,
                }
              : undefined,
          },
          activity: {
            connect: {
              id: Number(createDestinationDto.activityId),
              mediaId: createDestinationDto?.seo?.mediaId || undefined,
            },
          },
          seo: {
            create: {
              ...createDestinationDto.seo,
            },
          },
        },
      });
      return responseHelper.success('Destination created', destination);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error("Can't create destination", error.message),
      );
    }
  }

  async findAll() {
    const destinations = await this.prisma.destination.findMany({
      include: {
        activity: {
          select: {
            name: true,
            slug: true,
          },
        },
        media: {
          select: {
            thumbnail: true,
            alt: true,
          },
        },
        _count: {
          select: {
            packages: true,
          },
        },
      },
    });
    return responseHelper.success('All destinations', destinations);
  }

  async findOne(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: {
        slug,
      },
      include: {
        activity: {
          select: {
            name: true,
            slug: true,
          },
        },
        seo: {
          include: {
            media: true,
          },
        },
        media: true,
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            slug: true,
            price: true,
            groupSize: true,
            //  get on media from package

            media: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                thumbnail: true,
                alt: true,
              },
            },
            destination: {
              select: {
                name: true,
                slug: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });
    if (!destination) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }
    return responseHelper.success('Destination found', destination);
  }
  async findTopDestinations() {
    const destinations = await this.prisma.destination.findMany({
      take: 4,
      where: {
        activity: {
          name: 'Trekking',
        },
      },
      include: {
        activity: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            packages: true,
          },
        },
        seo: true,
      },
    });
    return responseHelper.success('Top destinations', destinations);
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    const existDestination = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!existDestination) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }

    const destination = await this.prisma.destination.update({
      where: { id },
      data: {
        name: updateDestinationDto.name,
        description: updateDestinationDto.description,
        slug: updateDestinationDto.slug || undefined,
        media: {
          connect: updateDestinationDto.mediaId
            ? {
                id: updateDestinationDto.mediaId,
              }
            : undefined,
        },
        activity: {
          connect: {
            id: Number(updateDestinationDto.activityId),
          },
        },
        seo: {
          update: {
            ...updateDestinationDto.seo,
            mediaId: updateDestinationDto?.seo?.mediaId || undefined,
          },
        },
      },
    });
    return responseHelper.success(
      'Destination updated successfully',
      destination,
    );
  }

  async remove(id: number) {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
      },
    });
    if (!destination) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }
    const response = await this.prisma.destination.delete({
      where: {
        id,
      },
    });
    return responseHelper.success('Destination deleted successfully', response);
  }
}
