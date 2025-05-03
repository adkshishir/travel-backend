import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SiteInfoService } from './site-info.service';
import { CreateSiteInfoDto } from './dto/create-site-info.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Site Information')
@Controller('api/site-info')
export class SiteInfoController {
  constructor(private readonly service: SiteInfoService) {}

  @Get()
  async getSiteInfo() {
    return this.service.getSiteInfo();
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  async updateSiteInfo(@Body() dto: CreateSiteInfoDto) {
    return this.service.updateSiteInfo(dto);
  }
}
