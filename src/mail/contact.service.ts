import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import responseHelper from 'src/utils/response-helper';

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

  async findAll() {
    try {
      const mails = await this.prisma.mail.findMany({
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
      });
      return responseHelper.success(
        'All contact messages retrieved successfully',
        mails,
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