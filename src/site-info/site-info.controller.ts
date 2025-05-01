import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SiteInfoService } from './site-info.service';
import { CreateSiteInfoDto } from './dto/create-site-info.dto';

@ApiTags('Site Information')
@Controller('api/site-info')
export class SiteInfoController {
  constructor(private readonly service: SiteInfoService) {}

  @Get()
  async getSiteInfo() {
    return this.service.getSiteInfo();
  }

  @Put()
  async updateSiteInfo(@Body() dto: CreateSiteInfoDto) {
    return this.service.updateSiteInfo(dto);
  }
}
