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
  @IsOptional()
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Entity associated with the file',
    type: String,
  })
  @IsString()
  @IsOptional()
  entity: string;
}
