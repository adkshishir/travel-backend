import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Mail } from 'src/database/entities/mail.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Mail)
    private readonly mailRepo: Repository<Mail>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const mail = this.mailRepo.create(createContactDto as any);
      await this.mailRepo.save(mail);
      return responseHelper.success('Contact message sent successfully', mail);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to send contact message', (error as Error).message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.mailRepo.find({
          skip,
          take: limit,
          relations: ['Media'],
          order: { createdAt: 'DESC' },
        }),
        this.mailRepo.count(),
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
        responseHelper.error('Failed to retrieve contact messages', (error as Error).message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const mail = await this.mailRepo.findOne({
        where: { id },
        relations: ['Media'],
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
        responseHelper.error('Failed to retrieve contact message', (error as Error).message),
      );
    }
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const existing = await this.mailRepo.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(
          responseHelper.error(`Contact message with ID ${id} not found`),
        );
      }
      Object.assign(existing, updateContactDto);
      const mail = await this.mailRepo.save(existing);
      return responseHelper.success('Contact message updated successfully', mail);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update contact message', (error as Error).message),
      );
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.mailRepo.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(
          responseHelper.error(`Contact message with ID ${id} not found`),
        );
      }
      await this.mailRepo.remove(existing);
      return responseHelper.success('Contact message deleted successfully', existing);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete contact message', (error as Error).message),
      );
    }
  }
}
