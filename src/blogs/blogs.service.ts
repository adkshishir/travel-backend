import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogDto: any) {
    try {
      const { seo, ...blogData } = createBlogDto;
      
      // Handle SEO creation if SEO data is provided
      let seoId = null;
      if (seo && (seo.metaTitle || seo.metaDescription || seo.metaKeywords || seo.metaCanonical || seo.schema || seo.mediaId)) {
        const createdSeo = await this.prisma.seo.create({
          data: {
            metaTitle: seo.metaTitle || null,
            metaDescription: seo.metaDescription || null,
            metaKeywords: seo.metaKeywords || null,
            metaCanonical: seo.metaCanonical || null,
            schema: seo.schema || null,
            mediaId: seo.mediaId || null,
          },
        });
        seoId = createdSeo.id;
      }

      const newBlog = await this.prisma.blog.create({
        data: {
          ...blogData,
          seoId,
        },
        include: { seo: true, media: true, author: true },
      });
      return responseHelper.success('Blog created successfully', newBlog);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create blog', error.message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.prisma.blog.findMany({
          skip,
          take: limit,
          include: { seo: true, media: true, author: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.blog.count(),
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
        responseHelper.error('Failed to retrieve blogs', error.message),
      );
    }
  }

  async findOne(slug: string) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { slug },
        include: { seo: true, media: true, author: true },
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
        responseHelper.error('Failed to retrieve blog', error.message),
      );
    }
  }

  async update(slug: string, updateBlogDto: any) {
    try {
      const blog = await this.prisma.blog.findUnique({ where: { slug } });
      if (!blog) {
        throw new NotFoundException(
          responseHelper.error(`Blog with slug ${slug} not found.`),
        );
      }

      const { seo, ...blogData } = updateBlogDto;
      
      // Handle SEO update/creation
      let seoId = blog.seoId;
      if (seo) {
        if (blog.seoId) {
          // Update existing SEO record
          await this.prisma.seo.update({
            where: { id: blog.seoId },
            data: {
              metaTitle: seo.metaTitle || null,
              metaDescription: seo.metaDescription || null,
              metaKeywords: seo.metaKeywords || null,
              metaCanonical: seo.metaCanonical || null,
              schema: seo.schema || null,
              mediaId: seo.mediaId || null,
            },
          });
        } else if (seo.metaTitle || seo.metaDescription || seo.metaKeywords || seo.metaCanonical || seo.schema || seo.mediaId) {
          // Create new SEO record if none exists
          const createdSeo = await this.prisma.seo.create({
            data: {
              metaTitle: seo.metaTitle || null,
              metaDescription: seo.metaDescription || null,
              metaKeywords: seo.metaKeywords || null,
              metaCanonical: seo.metaCanonical || null,
              schema: seo.schema || null,
              mediaId: seo.mediaId || null,
            },
          });
          seoId = createdSeo.id;
        }
      }

      const updatedBlog = await this.prisma.blog.update({
        where: { slug },
        data: {
          ...blogData,
          seoId,
        },
        include: { seo: true, media: true, author: true },
      });
      return responseHelper.success('Blog updated successfully', updatedBlog);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update blog', error.message),
      );
    }
  }

  async remove(slug: string) {
    try {
      const blog = await this.prisma.blog.findUnique({ where: { slug } });
      if (!blog) {
        throw new NotFoundException(
          responseHelper.error(`Blog with slug ${slug} not found.`),
        );
      }
      await this.prisma.blog.delete({ where: { slug } });
      return responseHelper.success('Blog deleted successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete blog', error.message),
      );
    }
  }
} 