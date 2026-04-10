import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from 'src/database/entities/wishlist.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
