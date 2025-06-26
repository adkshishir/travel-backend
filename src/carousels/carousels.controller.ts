import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CarouselsService } from './carousels.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('carousels')
@Controller('api/carousels')
export class CarouselsController {
  constructor(private readonly carouselsService: CarouselsService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCarouselDto: CreateCarouselDto) {
    return this.carouselsService.create(createCarouselDto);
  }

  @Get()
  findAll() {
    return this.carouselsService.findAll();
  }

  @Get(':page')
  findByPage(@Param('page') page: string) {
    return this.carouselsService.findByPage(page);
  }
  @Get('/getbyid/:id')
  findOneById(@Param('id') id: string) {
    return this.carouselsService.findOneById(+id);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselsService.update(+id, updateCarouselDto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carouselsService.remove(+id);
  }
}
