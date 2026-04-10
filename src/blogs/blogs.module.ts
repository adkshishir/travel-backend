import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog } from 'src/database/entities/blog.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Blog, Seo])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
