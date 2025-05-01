import { Express } from 'express';
import {
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUploadDto {
  @ApiProperty({
    description: 'File to be uploaded',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;

  @ApiProperty()
  @IsOptional()
  @IsString()
  folder?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  alt?: string;
}
