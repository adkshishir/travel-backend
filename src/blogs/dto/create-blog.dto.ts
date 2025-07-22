import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateBlogDto {
  @ApiProperty({ example: 'My Blog Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Short description of the blog', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Full blog content', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'my-blog-title' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Subtitle', required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ example: 'page-name', required: false })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({ type: CreateSeoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSeoDto)
  seo?: CreateSeoDto;

  @ApiProperty({ example: 1, required: false })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return parseInt(value);
  })
  @IsOptional()
  @IsInt()
  authorId?: number;

  @ApiProperty({ example: 'Publisher Name', required: false })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ example: 1, required: false })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return parseInt(value);
  })
  @IsOptional()
  @IsInt()
  mediaId?: number;
} 