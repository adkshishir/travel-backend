import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Blog } from 'src/database/entities/blog.entity';
import { Seo } from 'src/database/entities/seo.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(Seo)
    private readonly seoRepo: Repository<Seo>,
  ) {}

  async create(createBlogDto: any) {
    try {
      const { seo, ...blogData } = createBlogDto;

      let seoId: number | null = null;
      if (
        seo &&
        (seo.metaTitle ||
          seo.metaDescription ||
          seo.metaKeywords ||
          seo.metaCanonical ||
          seo.schema ||
          seo.mediaId)
      ) {
        const createdSeo = this.seoRepo.create({
          metaTitle: seo.metaTitle || null,
          metaDescription: seo.metaDescription || null,
          metaKeywords: seo.metaKeywords || null,
          metaCanonical: seo.metaCanonical || null,
          schema: seo.schema || null,
          mediaId: seo.mediaId || null,
        });
        await this.seoRepo.save(createdSeo);
        seoId = createdSeo.id;
      }

      const newBlog = this.blogRepo.create({
        ...blogData,
        seoId,
      } as Partial<Blog>);
      await this.blogRepo.save(newBlog);

      const full = await this.blogRepo.findOne({
        where: { id: (newBlog as Blog).id },
        relations: ['seo', 'media', 'author'],
      });
      return responseHelper.success('Blog created successfully', full);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create blog', (error as Error).message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.blogRepo.find({
          skip,
          take: limit,
          relations: ['seo', 'media', 'author'],
          order: { createdAt: 'DESC' },
        }),
        this.blogRepo.count(),
      ]);

      return responseHelper.success('All blogs', {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve blogs', (error as Error).message),
      );
    }
  }

  async findOne(slug: string) {
    try {
      const blog = await this.blogRepo.findOne({
        where: { slug },
        relations: ['seo', 'media', 'author'],
      });
      if (!blog) {
        throw new NotFoundException(
          responseHelper.error(`Blog with slug ${slug} not found.`),
        );
      }
      return responseHelper.success('Blog retrieved successfully', blog);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve blog', (error as Error).message),
      );
    }
  }

  async update(slug: string, updateBlogDto: any) {
    try {
      const blog = await this.blogRepo.findOne({ where: { slug } });
      if (!blog) {
        throw new NotFoundException(
          responseHelper.error(`Blog with slug ${slug} not found.`),
        );
      }

      const { seo, ...blogData } = updateBlogDto;

      let seoId = blog.seoId;
      if (seo) {
        if (blog.seoId) {
          const seoEnt = await this.seoRepo.findOne({ where: { id: blog.seoId } });
          if (seoEnt) {
            seoEnt.metaTitle = seo.metaTitle ?? seoEnt.metaTitle;
            seoEnt.metaDescription = seo.metaDescription ?? seoEnt.metaDescription;
            seoEnt.metaKeywords = seo.metaKeywords ?? seoEnt.metaKeywords;
            seoEnt.metaCanonical = seo.metaCanonical ?? seoEnt.metaCanonical;
            seoEnt.schema = seo.schema ?? seoEnt.schema;
            if (seo.mediaId !== undefined) seoEnt.mediaId = seo.mediaId;
            await this.seoRepo.save(seoEnt);
          }
        } else if (
          seo.metaTitle ||
          seo.metaDescription ||
          seo.metaKeywords ||
          seo.metaCanonical ||
          seo.schema ||
          seo.mediaId
        ) {
          const createdSeo = this.seoRepo.create({
            metaTitle: seo.metaTitle || null,
            metaDescription: seo.metaDescription || null,
            metaKeywords: seo.metaKeywords || null,
            metaCanonical: seo.metaCanonical || null,
            schema: seo.schema || null,
            mediaId: seo.mediaId || null,
          });
          await this.seoRepo.save(createdSeo);
          seoId = createdSeo.id;
        }
      }

      for (const [k, v] of Object.entries(blogData)) {
        if (v !== undefined) (blog as any)[k] = v;
      }
      blog.seoId = seoId;
      await this.blogRepo.save(blog);

      const updatedBlog = await this.blogRepo.findOne({
        where: { id: blog.id },
        relations: ['seo', 'media', 'author'],
      });
      return responseHelper.success('Blog updated successfully', updatedBlog);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update blog', (error as Error).message),
      );
    }
  }

  async remove(slug: string) {
    try {
      const blog = await this.blogRepo.findOne({ where: { slug } });
      if (!blog) {
        throw new NotFoundException(
          responseHelper.error(`Blog with slug ${slug} not found.`),
        );
      }
      await this.blogRepo.remove(blog);
      return responseHelper.success('Blog deleted successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete blog', (error as Error).message),
      );
    }
  }
}
