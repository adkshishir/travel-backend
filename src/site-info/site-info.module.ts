import { Module } from '@nestjs/common';
import { SiteInfoService } from './site-info.service';
import { SiteInfoController } from './site-info.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SiteInfoController],
  providers: [SiteInfoService, PrismaService,JwtService],
})
export class SiteInfoModule {}
