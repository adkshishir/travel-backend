import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';
import { Booking } from 'src/database/entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const booking = this.bookingRepo.create(createBookingDto as any);
      await this.bookingRepo.save(booking);
      return responseHelper.success('Booking created successfully', booking);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create booking', (error as Error).message),
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.bookingRepo.find({
          skip,
          take: limit,
          relations: ['package', 'package.destination', 'package.destination.activity'],
          order: { createdAt: 'DESC' },
        }),
        this.bookingRepo.count(),
      ]);

      return responseHelper.success('All bookings retrieved successfully', {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve bookings', (error as Error).message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingRepo.findOne({
        where: { id },
        relations: [
          'package',
          'package.destination',
          'package.destination.activity',
        ],
      });
      if (!booking) {
        throw new NotFoundException(
          responseHelper.error(`Booking with ID ${id} not found`),
        );
      }
      return responseHelper.success('Booking retrieved successfully', booking);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve booking', (error as Error).message),
      );
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const existing = await this.bookingRepo.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(
          responseHelper.error(`Booking with ID ${id} not found`),
        );
      }
      Object.assign(existing, updateBookingDto);
      const booking = await this.bookingRepo.save(existing);
      return responseHelper.success('Booking updated successfully', booking);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update booking', (error as Error).message),
      );
    }
  }

  async remove(id: number) {
    try {
      const existing = await this.bookingRepo.findOne({ where: { id } });
      if (!existing) {
        throw new NotFoundException(
          responseHelper.error(`Booking with ID ${id} not found`),
        );
      }
      await this.bookingRepo.remove(existing);
      return responseHelper.success('Booking deleted successfully', existing);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete booking', (error as Error).message),
      );
    }
  }
}
