import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateWishlistDto) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_packageId: { userId, packageId: dto.packageId } },
    });
    if (existing) {
      throw new ConflictException(responseHelper.error('Package already in wishlist'));
    }
    const item = await this.prisma.wishlist.create({
      data: { userId, packageId: dto.packageId },
      include: { package: { select: { id: true, title: true, slug: true, price: true, mainImage: true } } },
    });
    return responseHelper.success('Added to wishlist', item);
  }

  async findAll(userId: number) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            duration: true,
            rating: true,
            mainImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return responseHelper.success('Wishlist fetched', items);
  }

  async remove(userId: number, packageId: number) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_packageId: { userId, packageId } },
    });
    if (!item) {
      throw new NotFoundException(responseHelper.error('Wishlist item not found'));
    }
    await this.prisma.wishlist.delete({
      where: { userId_packageId: { userId, packageId } },
    });
    return responseHelper.success('Removed from wishlist');
  }
}
