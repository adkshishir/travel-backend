import { Module } from '@nestjs/common';
import { CarouselsService } from './carousels.service';
import { CarouselsController } from './carousels.controller';
import { UploadService } from 'src/upload/upload.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CarouselsController],
  providers: [CarouselsService, PrismaService, UploadService],
})
export class CarouselsModule {}
