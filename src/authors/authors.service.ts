import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Author } from 'src/database/entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<any> {
    const existingEmail = await this.authorRepo.findOne({
      where: { email: createAuthorDto.email },
    });

    const existingUsernameEmail = await this.authorRepo.findOne({
      where: {
        username: createAuthorDto.username,
        email: createAuthorDto.email,
      },
    });

    if (existingEmail) {
      const validationErrors: Record<string, string[]> = {};
      validationErrors.email = ['Email already exists'];

      throw new BadRequestException(
        responseHelper.validationError('Validation failed', validationErrors),
      );
    }

    if (existingUsernameEmail) {
      const validationErrors: Record<string, string[]> = {};
      validationErrors.username = ['Username and email combination already exists'];
      throw new BadRequestException(
        responseHelper.validationError('Validation failed', validationErrors),
      );
    }

    try {
      const author = this.authorRepo.create({
        name: createAuthorDto.name,
        username: createAuthorDto.username,
        email: createAuthorDto.email,
        bio: createAuthorDto.bio,
        socialLinks: createAuthorDto.socialLinks,
        website: createAuthorDto.website,
        role: createAuthorDto.role || 'author',
        status: createAuthorDto.status || 'active',
        mediaId: createAuthorDto.mediaId,
      });
      await this.authorRepo.save(author);

      const full = await this.authorRepo.findOne({
        where: { id: author.id },
        relations: ['media'],
      });

      if (!full) {
        throw new InternalServerErrorException(
          responseHelper.internalError('Failed to create author'),
        );
      }

      return responseHelper.success('Author created successfully', full);
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

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.authorRepo.find({
        skip,
        take: limit,
        relations: ['media'],
        order: { createdAt: 'DESC' },
      }),
      this.authorRepo.count(),
    ]);

    if (!items.length) {
      throw new NotFoundException(
        responseHelper.error('No authors found', null),
      );
    }

    return responseHelper.success('All authors', {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: number) {
    const author = await this.authorRepo.findOne({
      where: { id },
      relations: ['media', 'blogs'],
    });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    return responseHelper.success('Author found', author);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    Object.assign(author, updateAuthorDto);
    await this.authorRepo.save(author);
    const updatedAuthor = await this.authorRepo.findOne({
      where: { id },
      relations: ['media'],
    });
    return responseHelper.success('Author updated successfully', updatedAuthor);
  }

  async remove(id: number) {
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(
        responseHelper.error('No author found', null),
      );
    }
    await this.authorRepo.remove(author);
    return responseHelper.success('Author deleted successfully', author);
  }
}
