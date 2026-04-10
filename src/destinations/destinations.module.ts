import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { Destination } from 'src/database/entities/destination.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Destination, Seo])],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
