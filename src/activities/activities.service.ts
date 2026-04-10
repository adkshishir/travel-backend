import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Activity } from 'src/database/entities/activity.entity';
import { Seo } from 'src/database/entities/seo.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const exist = await this.activityRepo.findOne({
      where: { slug: createActivityDto.slug },
    });
    if (exist) {
      throw new NotFoundException(
        responseHelper.error('Activity already exist', null),
      );
    }

    try {
      let seoId: number | null = null;
      if (createActivityDto.seo) {
        const seoRow = this.seoRepo.create({
          ...createActivityDto.seo,
          mediaId: createActivityDto.seo?.mediaId ?? null,
        } as Partial<Seo>);
        await this.seoRepo.save(seoRow);
        seoId = seoRow.id;
      }

      const activity = this.activityRepo.create({
        name: createActivityDto.name,
        description: createActivityDto.description,
        slug: createActivityDto.slug,
        mediaId: createActivityDto.mediaId ?? null,
        seoId,
      });
      await this.activityRepo.save(activity);

      const full = await this.activityRepo.findOne({
        where: { id: activity.id },
        relations: ['seo', 'seo.media', 'media'],
      });
      return responseHelper.success('Activity created', full);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Activity not created', (error as Error).message),
        400,
      );
    }
  }

  async navItems() {
    const activities = await this.activityRepo.find({
      relations: ['destinations', 'destinations.packages'],
    });
    const shaped = activities.map((a) => ({
      name: a.name,
      slug: a.slug,
      destinations: (a.destinations || []).map((d) => ({
        name: d.name,
        slug: d.slug,
        packages: (d.packages || []).map((p) => ({
          title: p.title,
          slug: p.slug,
        })),
      })),
    }));
    return responseHelper.success('All activities', shaped);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const rows = await this.activityRepo
      .createQueryBuilder('act')
      .leftJoinAndSelect('act.media', 'media')
      .loadRelationCountAndMap('act.destCount', 'act.destinations')
      .orderBy('act.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const total = await this.activityRepo.count();

    const items = rows.map((a: any) => {
      const { destCount, ...rest } = a;
      return { ...rest, _count: { destinations: destCount ?? 0 } };
    });

    return responseHelper.success('All activities', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(slug: string) {
    const activity = await this.activityRepo.findOne({
      where: { slug },
      relations: ['seo', 'seo.media', 'media', 'destinations', 'destinations.media'],
    });
    if (!activity) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    return responseHelper.success('Activity found', activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    const old = await this.activityRepo.findOne({ where: { id } });
    if (!old) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    if (updateActivityDto.seo && old.seoId) {
      const seo = await this.seoRepo.findOne({ where: { id: old.seoId } });
      if (seo) {
        for (const [k, v] of Object.entries(updateActivityDto.seo)) {
          if (v !== undefined) (seo as any)[k] = v;
        }
        await this.seoRepo.save(seo);
      }
    }
    if (updateActivityDto.name !== undefined) old.name = updateActivityDto.name;
    if (updateActivityDto.description !== undefined)
      old.description = updateActivityDto.description;
    if (updateActivityDto.slug !== undefined) old.slug = updateActivityDto.slug;
    if (updateActivityDto.mediaId !== undefined) old.mediaId = updateActivityDto.mediaId;
    await this.activityRepo.save(old);

    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: ['seo', 'seo.media', 'media'],
    });
    return responseHelper.success('Activity updated successfully', activity);
  }

  async remove(id: number) {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(
        responseHelper.error('Activity not found', null),
      );
    }
    await this.activityRepo.remove(activity);
    return responseHelper.success('Activity deleted successfully', activity);
  }
}
