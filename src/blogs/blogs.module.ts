import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService,JwtService, UploadService],
})
export class BlogsModule {} 