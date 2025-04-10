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
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @ApiConsumes('multipart/form-data') // Specify the content type for Swagger
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateUploadDto })
  async uploadSingle(
    @Body(new ValidationPipe()) createUploadDto: CreateUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Handle the single file upload
    createUploadDto.file = file;
    return this.uploadService.processAndSave(createUploadDto);
  }
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.uploadService.deleteFile(+id);
  }
}
