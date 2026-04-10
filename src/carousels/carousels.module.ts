import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselsService } from './carousels.service';
import { CarouselsController } from './carousels.controller';
import { Carousel } from 'src/database/entities/carousel.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Carousel])],
  controllers: [CarouselsController],
  providers: [CarouselsService],
})
export class CarouselsModule {}
