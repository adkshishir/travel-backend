import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { Seo } from 'src/database/entities/seo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Seo])],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
