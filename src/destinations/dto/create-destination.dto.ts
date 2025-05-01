import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateDestinationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsString()
  slug: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  mediaId: number;
  @ApiProperty()
  @IsNumber()
  activityId: number;
  @ApiProperty()
  seo: CreateSeoDto;
}
