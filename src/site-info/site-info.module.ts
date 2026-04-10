import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteInfoService } from './site-info.service';
import { SiteInfoController } from './site-info.controller';
import { SiteInformation } from 'src/database/entities/site-information.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SiteInformation])],
  controllers: [SiteInfoController],
  providers: [SiteInfoService],
})
export class SiteInfoModule {}
