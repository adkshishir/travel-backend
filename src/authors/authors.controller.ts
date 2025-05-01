import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authors')
@Controller('api/authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}
  @ApiBearerAuth()
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, updateAuthorDto);
  }
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(+id);
  }
}
