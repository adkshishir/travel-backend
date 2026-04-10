import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from 'src/database/entities/category.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Category, Seo])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
