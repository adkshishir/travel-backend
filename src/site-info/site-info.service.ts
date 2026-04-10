import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSiteInfoDto } from './dto/create-site-info.dto';
import responseHelper from 'src/utils/response-helper';
import { SiteInformation } from 'src/database/entities/site-information.entity';

@Injectable()
export class SiteInfoService {
  constructor(
    @InjectRepository(SiteInformation)
    private readonly siteRepo: Repository<SiteInformation>,
  ) {}

  async getSiteInfo() {
    const [info] = await this.siteRepo.find({
      take: 1,
      order: { id: 'ASC' },
    });
    if (!info) return responseHelper.success('Site info not found', null);
    return responseHelper.success('Site info found', { ...info });
  }

  async updateSiteInfo(dto: CreateSiteInfoDto) {
    const [existing] = await this.siteRepo.find({
      take: 1,
      order: { id: 'ASC' },
    });

    if (existing) {
      Object.assign(existing, dto);
      const updated = await this.siteRepo.save(existing);
      return responseHelper.success('Site info updated successfully', {
        ...updated,
      });
    }
    const created = this.siteRepo.create({ ...dto });
    const updated = await this.siteRepo.save(created);
    return responseHelper.success('Site info created successfully', {
      ...updated,
    });
  }
}
