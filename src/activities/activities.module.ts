import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService,UploadService,JwtService],
})
export class ActivitiesModule {}
