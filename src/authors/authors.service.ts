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
  async create(createAuthorDto: CreateAuthorDto) {
    const exitAuthor = await this.prisma.author.findUnique({
      where: {
        email: createAuthorDto.email,
      },
    });
    if (exitAuthor) {
      throw new BadRequestException(
        responseHelper.error('Author: Email and Username already exists', {
          username: ['username already exists'],
          email: ['email already exists'],
        }),
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
        },
      });
      if (!author) {
        throw new InternalServerErrorException(
          responseHelper.error('Author not created', null),
        );
      }
      return responseHelper.success('Author: Firstname Lastname', author);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error(
          (await error.Message) || 'Author not created Internal Server Error',
          await error,
        ),
      );
    }
  }

  async findAll() {
    const authors = await this.prisma.author.findMany({
      select: {
        name: true,
        username: true,
        email: true,
        id: true,
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
    });
    return responseHelper.success('Author: Firstname Lastname', updatedAuthor);
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
    return responseHelper.success('Author: Firstname Lastname', deletedAuthor);
  }
}
