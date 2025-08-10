import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAuthorDto: CreateAuthorDto): Promise<any> {
    // Check for existing email (email is unique)
    const existingEmail = await this.prisma.author.findUnique({
      where: { email: createAuthorDto.email },
    });

    // Check for existing username+email combination
    const existingUsernameEmail = await this.prisma.author.findUnique({
      where: { 
        username_email: {
          username: createAuthorDto.username,
          email: createAuthorDto.email
        }
      },
    });

    if (existingEmail) {
      const validationErrors: Record<string, string[]> = {};
      validationErrors.email = ['Email already exists'];

      throw new BadRequestException(
        responseHelper.validationError('Validation failed', validationErrors),
      );
    }

    try {
      const author = await this.prisma.author.create({
        data: {
          name: createAuthorDto.name,
          username: createAuthorDto.username,
          email: createAuthorDto.email,
          bio: createAuthorDto.bio,
          socialLinks: createAuthorDto.socialLinks,
          website: createAuthorDto.website,
          role: createAuthorDto.role || 'author',
          status: createAuthorDto.status || 'active',
          mediaId: createAuthorDto.mediaId,
        },
        include: { media: true },
      });

      if (!author) {
        throw new InternalServerErrorException(
          responseHelper.internalError('Failed to create author'),
        );
      }

      return responseHelper.success('Author created successfully', author);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        responseHelper.internalError(
          'An error occurred while creating the author',
          error,
        ),
      );
    }
  }

  async findAll() {
    const authors = await this.prisma.author.findMany({
      include: {
        media: true,
      },
    });
    if (!authors.length) {
      throw new NotFoundException(
        responseHelper.error('No authors found', null),
      );
    }

    return responseHelper.success('All authors', authors);
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        media: true,
        blogs: {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            isPublished: true,
          },
        },
      },
    });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    return responseHelper.success('Author found', author);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    const updatedAuthor = await this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
      include: { media: true },
    });
    return responseHelper.success('Author updated successfully', updatedAuthor);
  }

  async remove(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    const deletedAuthor = await this.prisma.author.delete({
      where: { id },
    });
    return responseHelper.success('Author deleted successfully', deletedAuthor);
  }
}
