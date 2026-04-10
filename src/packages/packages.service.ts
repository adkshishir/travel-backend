import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FilterPackageDto } from './dto/filter-package.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Package } from 'src/database/entities/package.entity';
import { Media } from 'src/database/entities/media.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { Faq } from 'src/database/entities/faq.entity';

const PKG_LIST_RELATIONS = ['mainImage', 'destination', 'reviews'] as const;
const PKG_DETAIL_RELATIONS = [
  'destination',
  'destination.activity',
  'map',
  'seo',
  'seo.media',
  'mainImage',
  'media',
  'faqs',
] as const;

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const exist = await this.packageRepo.findOne({
      where: { slug: createPackageDto.slug },
    });
    if (exist) {
      throw new BadRequestException(
        responseHelper.error('Package already exist', {
          slug: ['Package already exist'],
        }),
      );
    }
    try {
      return await this.dataSource.transaction(async (mgr) => {
        const {
          destinationId,
          mediaIds,
          mainImageId,
          faqs,
          mapId,
          seo: seoDto,
          ...rest
        } = createPackageDto;

        const seo = mgr.create(Seo, {
          metaTitle: seoDto?.metaTitle ?? null,
          metaDescription: seoDto?.metaDescription ?? null,
          metaKeywords: seoDto?.metaKeywords ?? null,
          metaCanonical: seoDto?.metaCanonical ?? null,
          schema: seoDto?.schema ?? null,
          mediaId: seoDto?.mediaId ?? null,
        });
        await mgr.save(seo);

        const pkg = mgr.create(Package, {
          ...rest,
          destinationId,
          mapId: mapId ?? null,
          mainImageId: mainImageId ?? null,
          seoId: seo.id,
        });
        await mgr.save(pkg);

        if (mediaIds?.length) {
          await mgr
            .createQueryBuilder()
            .relation(Package, 'media')
            .of(pkg.id)
            .add(mediaIds);
        }
        if (faqs?.length) {
          await mgr.insert(
            Faq,
            faqs.map((f) => ({
              question: f.question,
              answer: f.answer,
              packageId: pkg.id,
            })),
          );
        }

        const full = await mgr.findOne(Package, {
          where: { id: pkg.id },
          relations: [...PKG_DETAIL_RELATIONS, 'reviews'],
        });
        return responseHelper.success('Package created successfully', full);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error("Package can't be created", error.message),
      );
    }
  }

  async search(filterDto: FilterPackageDto, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.packageRepo
      .createQueryBuilder('pkg')
      .leftJoinAndSelect('pkg.mainImage', 'mainImage')
      .leftJoinAndSelect('pkg.destination', 'destination')
      .leftJoinAndSelect('pkg.reviews', 'reviews');

    if (filterDto.search) {
      const s = `%${filterDto.search}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('pkg.title LIKE :s', { s }).orWhere('pkg.description LIKE :s', {
            s,
          });
        }),
      );
    }
    if (filterDto.destinationId) {
      qb.andWhere('pkg.destinationId = :did', { did: filterDto.destinationId });
    }
    if (filterDto.bestSeason) {
      qb.andWhere('pkg.bestSeason LIKE :bs', { bs: `%${filterDto.bestSeason}%` });
    }
    if (filterDto.activity) {
      qb.andWhere('pkg.activity LIKE :act', { act: `%${filterDto.activity}%` });
    }

    const validSortFields = ['rating', 'createdAt', 'title'];
    const sortField =
      filterDto.sortBy && validSortFields.includes(filterDto.sortBy)
        ? filterDto.sortBy
        : 'createdAt';
    const sortOrder =
      filterDto.sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy(`pkg.${sortField}`, sortOrder);

    const countQb = this.packageRepo.createQueryBuilder('pkg');
    if (filterDto.search) {
      const s = `%${filterDto.search}%`;
      countQb.andWhere(
        new Brackets((sub) => {
          sub.where('pkg.title LIKE :s', { s }).orWhere('pkg.description LIKE :s', {
            s,
          });
        }),
      );
    }
    if (filterDto.destinationId) {
      countQb.andWhere('pkg.destinationId = :did', { did: filterDto.destinationId });
    }
    if (filterDto.bestSeason) {
      countQb.andWhere('pkg.bestSeason LIKE :bs', { bs: `%${filterDto.bestSeason}%` });
    }
    if (filterDto.activity) {
      countQb.andWhere('pkg.activity LIKE :act', { act: `%${filterDto.activity}%` });
    }

    const [items, total] = await Promise.all([
      qb.skip(skip).take(limit).getMany(),
      countQb.getCount(),
    ]);

    return responseHelper.success('Packages fetched successfully', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.packageRepo.find({
        skip,
        take: limit,
        relations: ['media', 'destination', 'destination.activity'],
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          price: true,
          groupSize: true,
          createdAt: true,
          media: { thumbnail: true, alt: true },
          destination: {
            name: true,
            slug: true,
            activity: { name: true, slug: true },
          },
        },
        order: { createdAt: 'DESC' },
      }),
      this.packageRepo.count(),
    ]);

    return responseHelper.success('All packages', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(slug: string) {
    const pkg = await this.packageRepo.findOne({
      where: { slug },
      relations: [...PKG_DETAIL_RELATIONS],
    });
    if (!pkg) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${slug} not found.`),
      );
    }
    const relatedPackages = await this.packageRepo.find({
      where: { destinationId: pkg.destinationId },
      relations: ['destination', 'media'],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        price: true,
        groupSize: true,
        destination: { name: true, slug: true },
        media: { alt: true, thumbnail: true },
      },
      order: { createdAt: 'DESC' },
    });
    const filtered = relatedPackages.filter((p) => p.id !== pkg.id);

    return responseHelper.success('Package found', {
      package: pkg,
      relatedPackages: filtered,
    });
  }

  async update(id: number, updateDto: UpdatePackageDto) {
    const existing = await this.packageRepo.findOne({
      where: { id },
      relations: ['media'],
    });
    if (!existing) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${id} not found.`),
      );
    }

    const { destinationId, mediaIds, mainImageId, faqs, mapId, seo: seoDto, ...rest } =
      updateDto;

    await this.dataSource.transaction(async (mgr) => {
      await mgr
        .createQueryBuilder()
        .delete()
        .from('_mediaPackages')
        .where('B = :id', { id })
        .execute();
      await mgr.delete(Media, { packageId: id });

      if (faqs?.length) {
        await mgr.delete(Faq, { packageId: id });
      }

      if (seoDto && existing.seoId) {
        const seoEnt = await mgr.findOne(Seo, { where: { id: existing.seoId } });
        if (seoEnt) {
          for (const [k, v] of Object.entries(seoDto)) {
            if (v !== undefined) (seoEnt as any)[k] = v;
          }
          await mgr.save(seoEnt);
        }
      }

      const pkgEnt = await mgr.findOne(Package, { where: { id } });
      if (pkgEnt) {
        for (const [k, v] of Object.entries(rest)) {
          if (v !== undefined) (pkgEnt as any)[k] = v;
        }
        if (destinationId !== undefined) pkgEnt.destinationId = destinationId;
        if (mapId !== undefined) pkgEnt.mapId = mapId;
        if (mainImageId !== undefined) pkgEnt.mainImageId = mainImageId;
        await mgr.save(pkgEnt);
      }

      if (mediaIds?.length) {
        await mgr
          .createQueryBuilder()
          .relation(Package, 'media')
          .of(id)
          .add(mediaIds);
      }
      if (faqs?.length) {
        await mgr.insert(
          Faq,
          faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
            packageId: id,
          })),
        );
      }
    });

    const updated = await this.packageRepo.findOne({
      where: { id },
      relations: [...PKG_DETAIL_RELATIONS, 'reviews'],
    });
    return responseHelper.success('Package updated successfully', updated);
  }

  async remove(id: number) {
    const existing = await this.packageRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(
        responseHelper.error(`Package with ID ${id} not found.`),
      );
    }
    const deleted = await this.packageRepo.remove(existing);
    return responseHelper.success('Package deleted successfully', deleted);
  }
}
