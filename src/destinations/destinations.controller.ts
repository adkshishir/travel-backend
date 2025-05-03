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
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/destinations')
@ApiTags('Destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Get()
  findAll() {
    return this.destinationsService.findAll();
  }
  @Get('top')
  findTopDestinations() {
    return this.destinationsService.findTopDestinations();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.destinationsService.findOne(slug);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(+id, updateDestinationDto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(+id);
  }
}
