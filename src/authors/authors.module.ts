import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, PrismaService,JwtService],
})
export class AuthorsModule {}
