import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Activity } from 'src/database/entities/activity.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Activity, Seo])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
