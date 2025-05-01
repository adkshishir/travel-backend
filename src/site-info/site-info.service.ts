import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteInfoDto } from './dto/create-site-info.dto';
import responseHelper from 'src/utils/response-helper';

@Injectable()
export class SiteInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getSiteInfo() {
    const info = await this.prisma.siteInformation.findFirst();
    if (!info) return responseHelper.success('Site info not found', null);
    return responseHelper.success('Site info found', { ...info });
  }

  async updateSiteInfo(dto: CreateSiteInfoDto) {
    const existing = await this.prisma.siteInformation.findFirst();

    if (existing) {
      const updated = await this.prisma.siteInformation.update({
        where: { id: existing.id },
        data: { ...dto },
      });
      return responseHelper.success('Site info updated successfully', {
        ...updated,
      });
    }
    const updated = await this.prisma.siteInformation.create({
      data: { ...dto },
    });
    return responseHelper.success('Site info created successfully', {
      ...updated,
    });
  }
}
