import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Unique endpoint identifier (e.g., about-us, privacy-policy)' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'Page content in HTML or markdown format' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Page title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'URL slug for the page', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Whether the page is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'SEO configuration', required: false })
  @IsOptional()
  seo?: CreateSeoDto;
} 