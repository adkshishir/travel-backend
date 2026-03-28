import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('SEO')
@Controller('api/seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSeoDto: CreateSeoDto) {
    return this.seoService.create(createSeoDto);
  }

  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seoService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeoDto: UpdateSeoDto) {
    return this.seoService.update(+id, updateSeoDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seoService.remove(+id);
  }
}
