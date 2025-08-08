import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ required: false })
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ required: false })
  message?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  mediaId?: number;
} 