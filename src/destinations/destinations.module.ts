import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { PrismaService } from 'src//prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [DestinationsController],
  providers: [DestinationsService,PrismaService,UploadService],
})
export class DestinationsModule {}
