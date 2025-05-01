import { Module } from '@nestjs/common';
import { SiteInfoService } from './site-info.service';
import { SiteInfoController } from './site-info.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SiteInfoController],
  providers: [SiteInfoService, PrismaService],
})
export class SiteInfoModule {}
