import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

class CreateFaqDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  answer?: string;
}

export class CreatePackageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accommodation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  altitude?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bestSeason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  culture?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attractions?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mainImageId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupSize?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupAge?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nature?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itinerary?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  includes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  goodtoknow?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  highlights?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  mapId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  seo: CreateSeoDto;

  @ApiProperty()
  @IsInt()
  destinationId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  mediaIds?: number[];

  @ApiProperty({ required: false, type: [CreateFaqDto] })
  @IsOptional()
  @IsArray()
  faqs?: CreateFaqDto[];
}
