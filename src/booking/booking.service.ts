import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const booking = await this.prisma.booking.create({
        data: createBookingDto,
      });
      return responseHelper.success('Booking created successfully', booking);
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to create booking', error.message),
      );
    }
  }

  async findAll() {
    try {
      const bookings = await this.prisma.booking.findMany();
      return responseHelper.success(
        'All bookings retrieved successfully',
        bookings,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        responseHelper.error('Failed to retrieve bookings', error.message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
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
        responseHelper.error('Failed to retrieve booking', error.message),
      );
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const booking = await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
      });
      return responseHelper.success('Booking updated successfully', booking);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          responseHelper.error(`Booking with ID ${id} not found`),
        );
      }
      throw new InternalServerErrorException(
        responseHelper.error('Failed to update booking', error.message),
      );
    }
  }

  async remove(id: number) {
    try {
      const booking = await this.prisma.booking.delete({
        where: { id },
      });
      return responseHelper.success('Booking deleted successfully', booking);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          responseHelper.error(`Booking with ID ${id} not found`),
        );
      }
      throw new InternalServerErrorException(
        responseHelper.error('Failed to delete booking', error.message),
      );
    }
  }
}
