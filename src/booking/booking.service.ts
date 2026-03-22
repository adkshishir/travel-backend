import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import responseHelper from 'src/utils/response-helper';
import { PaginationDto } from 'src/utils/pagination.dto';

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

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.prisma.booking.findMany({
          skip,
          take: limit,
          include: {
            package: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                destination: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    activity: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.booking.count(),
      ]);

      return responseHelper.success(
        'All bookings retrieved successfully',
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
        responseHelper.error('Failed to retrieve bookings', error.message),
      );
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          package: {
            include: {
              destination: {
                include: {
                  activity: true
                }
              }
            }
          }
        }
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
