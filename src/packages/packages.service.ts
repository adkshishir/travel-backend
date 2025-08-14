import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto) {
    const exist = await this.prisma.package.findUnique({
      where: {
        slug: createPackageDto.slug,
      },
    });
    if (exist) {
      throw new BadRequestException(
        responseHelper.error('Package already exist', {
          slug: ['Package already exist'],
        }),
      );
    }
    try {
      const { destinationId, mediaIds, mainImageId, faqs, mapId, ...rest } =
        createPackageDto;
      const pkgData = {
        ...rest,
        destination: destinationId
          ? { connect: { id: destinationId } }
          : undefined,
        map: mapId ? { connect: { id: mapId } } : undefined,

        seo: {
          create: {
            ...createPackageDto.seo,
            mediaId: createPackageDto.seo?.mediaId || undefined,
          },
        },
        media:
          mediaIds?.length > 0
            ? {
                connect: mediaIds?.map((m) => ({ id: m })),
              }
            : undefined,
        faqs: { createMany: { data: faqs } },
        mainImage: mainImageId ? { connect: { id: mainImageId } } : undefined,
      };

      return responseHelper.success(
        'Package created successfully',
        await this.prisma.package.create({ data: pkgData }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error("Package can't be created", error.message),
      );
    }
  }

  async findAll() {
    const data = await this.prisma.package.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        price: true,
        groupSize: true,
        media: {
          select: {
            thumbnail: true,
            alt: true,
          },
        },
        destination: {
          select: {
            name: true,
            slug: true,
            activity: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    return responseHelper.success('All packages', data);
  }

  async findOne(slug: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { slug },
      include: {
        destination: {
          select: {
            name: true,
            slug: true,
            activity: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        map: true,
        seo: {
          include: {
            media: true,
          },
        },
        mainImage: true,
        media: true,
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });
    if (!pkg) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${slug} not found.`),
      );
    }
    const relatedPackages = await this.prisma.package.findMany({
      where: { destinationId: pkg.destinationId, NOT: { id: pkg.id } },
      select: {
        destination: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        price: true,
        groupSize: true,
        media: {
          select: {
            alt: true,
            thumbnail: true,
          },
        },
      },
    });

    return responseHelper.success('Package found', {
      package: pkg,
      relatedPackages,
    });
  }

  async update(id: number, updateDto: UpdatePackageDto) {
    const existing = await this.prisma.package.findUnique({ 
      where: { id },
      include: { media: true }
    });
    const { destinationId, mediaIds, mainImageId, faqs, mapId, ...rest } =
      updateDto;

    if (!existing) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${id} not found.`),
      );
    }
     await this.prisma.media.deleteMany({
      where:{
        packageId:id
      }
     }) 
    const updated = await this.prisma.package.update({
      where: { id },
      data: {
        ...rest,
        destination: updateDto.destinationId
          ? { connect: { id: updateDto.destinationId } }
          : undefined,
        map: updateDto.mapId ? { connect: { id: updateDto.mapId } } : undefined,
        media: mediaIds?.length > 0
          ? {
              set: mediaIds?.map((m) => ({ id: m })),
            }
          : { set: [] },
        mainImage: mainImageId ? { connect: { id: mainImageId } } : undefined,
        seo: {
          update: {
            ...updateDto.seo,
            mediaId: updateDto.seo?.mediaId || undefined,
          },
        },
        faqs:
          faqs?.length > 0
            ? {
                deleteMany: {},
                createMany: {
                  data: faqs,
                },
              }
            : undefined,
      },
    });

    return responseHelper.success('Package updated successfully', updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.package.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${id} not found.`),
      );
    }
    const deleted = await this.prisma.package.delete({ where: { id } });
    return responseHelper.success('Package deleted successfully', deleted);
  }
}
