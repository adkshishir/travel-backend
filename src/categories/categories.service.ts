import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Category } from 'src/database/entities/category.entity';
import { Seo } from 'src/database/entities/seo.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exist = await this.categoryRepo.findOne({
      where: { endpoint: createCategoryDto.endpoint },
    });
    if (exist) {
      throw new NotFoundException(
        responseHelper.error('Category with this endpoint already exists', null),
      );
    }

    try {
      let seoId: number | null = null;
      if (createCategoryDto.seo) {
        const seoRow = this.seoRepo.create({
          ...createCategoryDto.seo,
          mediaId: createCategoryDto.seo?.mediaId ?? null,
        } as Partial<Seo>);
        await this.seoRepo.save(seoRow);
        seoId = seoRow.id;
      }

      const category = this.categoryRepo.create({
        endpoint: createCategoryDto.endpoint,
        content: createCategoryDto.content,
        title: createCategoryDto.title,
        slug: createCategoryDto.slug || createCategoryDto.endpoint,
        isActive: createCategoryDto.isActive ?? true,
        seoId,
      });
      await this.categoryRepo.save(category);

      const full = await this.categoryRepo.findOne({
        where: { id: category.id },
        relations: ['seo', 'seo.media'],
      });
      return responseHelper.success('Category created successfully', full);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not created', (error as Error).message),
        400,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.categoryRepo.find({
        skip,
        take: limit,
        relations: ['seo', 'seo.media'],
        order: { createdAt: 'DESC' },
      }),
      this.categoryRepo.count(),
    ]);

    return responseHelper.success('All categories', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(identifier: string) {
    const category = await this.categoryRepo.findOne({
      where: [{ endpoint: identifier }, { slug: identifier }],
      relations: ['seo', 'seo.media'],
    });

    if (!category) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    return responseHelper.success('Category found', category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const exist = await this.categoryRepo.findOne({ where: { id } });

    if (!exist) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    if (updateCategoryDto.endpoint && updateCategoryDto.endpoint !== exist.endpoint) {
      const endpointExists = await this.categoryRepo.findOne({
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
      if (updateCategoryDto.seo) {
        if (exist.seoId) {
          const seo = await this.seoRepo.findOne({ where: { id: exist.seoId } });
          if (seo) {
            for (const [k, v] of Object.entries(updateCategoryDto.seo)) {
              if (v !== undefined) (seo as any)[k] = v;
            }
            await this.seoRepo.save(seo);
          }
        } else {
          const seoRow = this.seoRepo.create({
            ...updateCategoryDto.seo,
            mediaId: updateCategoryDto.seo?.mediaId ?? null,
          } as Partial<Seo>);
          await this.seoRepo.save(seoRow);
          exist.seoId = seoRow.id;
        }
      }

      if (updateCategoryDto.endpoint !== undefined)
        exist.endpoint = updateCategoryDto.endpoint;
      if (updateCategoryDto.content !== undefined)
        exist.content = updateCategoryDto.content;
      if (updateCategoryDto.title !== undefined) exist.title = updateCategoryDto.title;
      if (updateCategoryDto.slug !== undefined) exist.slug = updateCategoryDto.slug;
      if (updateCategoryDto.isActive !== undefined)
        exist.isActive = updateCategoryDto.isActive;

      await this.categoryRepo.save(exist);

      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: ['seo', 'seo.media'],
      });
      return responseHelper.success('Category updated successfully', category);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not updated', (error as Error).message),
        400,
      );
    }
  }

  async remove(id: number) {
    const exist = await this.categoryRepo.findOne({ where: { id } });

    if (!exist) {
      throw new NotFoundException(
        responseHelper.error('Category not found', null),
      );
    }

    try {
      await this.categoryRepo.remove(exist);
      return responseHelper.success('Category deleted successfully', null);
    } catch (error) {
      throw new HttpException(
        responseHelper.error('Category not deleted', (error as Error).message),
        400,
      );
    }
  }
}
