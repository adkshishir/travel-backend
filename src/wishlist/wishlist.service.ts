import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from 'src/database/entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
  ) {}

  async create(userId: number, dto: CreateWishlistDto) {
    const existing = await this.wishlistRepo.findOne({
      where: { userId, packageId: dto.packageId },
    });
    if (existing) {
      throw new ConflictException(responseHelper.error('Package already in wishlist'));
    }
    const row = this.wishlistRepo.create({
      userId,
      packageId: dto.packageId,
    });
    await this.wishlistRepo.save(row);
    const item = await this.wishlistRepo.findOne({
      where: { id: row.id },
      relations: ['package', 'package.mainImage'],
    });
    return responseHelper.success('Added to wishlist', item);
  }

  async findAll(userId: number) {
    const items = await this.wishlistRepo.find({
      where: { userId },
      relations: ['package', 'package.mainImage'],
      order: { createdAt: 'DESC' },
    });
    return responseHelper.success('Wishlist fetched', items);
  }

  async remove(userId: number, packageId: number) {
    const item = await this.wishlistRepo.findOne({
      where: { userId, packageId },
    });
    if (!item) {
      throw new NotFoundException(responseHelper.error('Wishlist item not found'));
    }
    await this.wishlistRepo.remove(item);
    return responseHelper.success('Removed from wishlist');
  }
}
