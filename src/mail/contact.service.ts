import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const mail = await this.prisma.mail.create({
        data: createContactDto,
      });
      return responseHelper.success('Contact message sent successfully', mail);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to send contact message', error.message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.prisma.mail.findMany({
          skip,
          take: limit,
          include: {
            Media: {
              select: {
                id: true,
                thumbnail: true,
                original: true,
                alt: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.mail.count(),
      ]);

      return responseHelper.success(
        'All contact messages retrieved successfully',
        {
          items,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve contact messages', error.message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const mail = await this.prisma.mail.findUnique({
        where: { id },
        include: {
          Media: true
        }
      });
      if (!mail) {
        throw new NotFoundException(
          responseHelper.error(`Contact message with ID ${id} not found`),
        );
      }
      return responseHelper.success('Contact message retrieved successfully', mail);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve contact message', error.message),
      );
    }
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const mail = await this.prisma.mail.update({
        where: { id },
        data: updateContactDto,
      });
      return responseHelper.success('Contact message updated successfully', mail);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          responseHelper.error(`Contact message with ID ${id} not found`),
        );
      }
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update contact message', error.message),
      );
    }
  }

  async remove(id: number) {
    try {
      const mail = await this.prisma.mail.delete({
        where: { id },
      });
      return responseHelper.success('Contact message deleted successfully', mail);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          responseHelper.error(`Contact message with ID ${id} not found`),
        );
      }
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete contact message', error.message),
      );
    }
  }
} 