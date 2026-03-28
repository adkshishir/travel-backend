import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Delete(':packageId')
  remove(@Req() req: any, @Param('packageId', ParseIntPipe) packageId: number) {
    return this.wishlistService.remove(req.user.id, packageId);
  }
}
