import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Destination } from 'src/database/entities/destination.entity';
import { Seo } from 'src/database/entities/seo.entity';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepo: Repository<Destination>,
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
  ) {}

  async create(createDestinationDto: CreateDestinationDto) {
    const existDestination = await this.destinationRepo.findOne({
      where: { slug: createDestinationDto.slug },
    });
    if (existDestination) {
      throw new BadRequestException(
        responseHelper.error('Destination already exist', {
          slug: ['Destination already exist'],
        }),
      );
    }

    try {
      const seoRow = this.seoRepo.create({
        ...createDestinationDto.seo,
        mediaId: createDestinationDto.seo?.mediaId ?? null,
      } as Partial<Seo>);
      await this.seoRepo.save(seoRow);

      const destination = this.destinationRepo.create({
        name: createDestinationDto.name,
        description: createDestinationDto.description,
        slug: createDestinationDto.slug,
        mediaId: createDestinationDto.mediaId ?? null,
        activityId: createDestinationDto.activityId,
        seoId: seoRow.id,
      });
      await this.destinationRepo.save(destination);

      return responseHelper.success('Destination created', destination);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error("Can't create destination", (error as Error).message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const rows = await this.destinationRepo
      .createQueryBuilder('dest')
      .leftJoinAndSelect('dest.activity', 'activity')
      .leftJoinAndSelect('dest.media', 'media')
      .loadRelationCountAndMap('dest.pkgCount', 'dest.packages')
      .orderBy('dest.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const total = await this.destinationRepo.count();

    const items = rows.map((d: any) => {
      const { pkgCount, ...rest } = d;
      return { ...rest, _count: { packages: pkgCount ?? 0 } };
    });

    return responseHelper.success('All destinations', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(slug: string) {
    const dest = await this.destinationRepo.findOne({
      where: { slug },
      relations: [
        'activity',
        'seo',
        'seo.media',
        'media',
        'packages',
        'packages.media',
        'packages.destination',
      ],
    });
    if (!dest) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }

    const packages = (dest.packages || []).map((p) => {
      const mediaSorted = [...(p.media || [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const thumb = mediaSorted[0];
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        duration: p.duration,
        slug: p.slug,
        price: p.price,
        groupSize: p.groupSize,
        media: thumb
          ? [{ thumbnail: thumb.thumbnail, alt: thumb.alt }]
          : [],
        destination: p.destination
          ? { name: p.destination.name, slug: p.destination.slug }
          : undefined,
        createdAt: p.createdAt,
      };
    });

    const { packages: _pkgs, ...rest } = dest;
    return responseHelper.success('Destination found', {
      ...rest,
      packages,
    });
  }

  async findTopDestinations() {
    const rows = await this.destinationRepo
      .createQueryBuilder('dest')
      .leftJoinAndSelect('dest.activity', 'activity')
      .leftJoinAndSelect('dest.seo', 'seo')
      .loadRelationCountAndMap('dest.pkgCount', 'dest.packages')
      .where('activity.name = :name', { name: 'Trekking' })
      .orderBy('dest.createdAt', 'DESC')
      .take(4)
      .getMany();

    const destinations = rows.map((d: any) => {
      const { pkgCount, ...rest } = d;
      return { ...rest, _count: { packages: pkgCount ?? 0 } };
    });

    return responseHelper.success('Top destinations', destinations);
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    const existDestination = await this.destinationRepo.findOne({ where: { id } });

    if (!existDestination) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }

    if (updateDestinationDto.seo && existDestination.seoId) {
      const seo = await this.seoRepo.findOne({ where: { id: existDestination.seoId } });
      if (seo) {
        for (const [k, v] of Object.entries(updateDestinationDto.seo)) {
          if (v !== undefined) (seo as any)[k] = v;
        }
        if (updateDestinationDto.seo.mediaId !== undefined) {
          seo.mediaId = updateDestinationDto.seo.mediaId;
        }
        await this.seoRepo.save(seo);
      }
    }

    if (updateDestinationDto.name !== undefined)
      existDestination.name = updateDestinationDto.name;
    if (updateDestinationDto.description !== undefined)
      existDestination.description = updateDestinationDto.description;
    if (updateDestinationDto.slug !== undefined)
      existDestination.slug = updateDestinationDto.slug;
    if (updateDestinationDto.mediaId !== undefined)
      existDestination.mediaId = updateDestinationDto.mediaId;
    if (updateDestinationDto.activityId !== undefined)
      existDestination.activityId = updateDestinationDto.activityId;

    const destination = await this.destinationRepo.save(existDestination);
    return responseHelper.success(
      'Destination updated successfully',
      destination,
    );
  }

  async remove(id: number) {
    const destination = await this.destinationRepo.findOne({ where: { id } });
    if (!destination) {
      throw new NotFoundException(
        responseHelper.error('Destination not found', null),
      );
    }
    await this.destinationRepo.remove(destination);
    return responseHelper.success('Destination deleted successfully', destination);
  }
}
