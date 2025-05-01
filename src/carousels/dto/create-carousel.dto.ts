import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarouselDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'title',
    description: 'title of the carousel',
  })
  title: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'description',
    description: 'description of the carousel',
  })
  description: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'link',
    description: 'Link of the carousel',
  })
  link: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'subtitle',
    description: 'Subtitle of the carousel',
  })
  subtitle: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'page',
    description: 'page of the carousel',
  })
  page: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  mediaId: number;
}
