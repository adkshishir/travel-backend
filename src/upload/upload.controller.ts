import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ValidationPipe,
  UploadedFile,
  UploadedFiles,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @ApiConsumes('multipart/form-data') // Specify the content type for Swagger
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateUploadDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async uploadSingle(
    @Body(new ValidationPipe()) createUploadDto: CreateUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Handle the single file upload
    createUploadDto.file = file;
    return this.uploadService.processAndSave(createUploadDto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.uploadService.deleteFile(+id);
  }
  @Get()
  async findAll() {
    return this.uploadService.findAll();
  }
}
