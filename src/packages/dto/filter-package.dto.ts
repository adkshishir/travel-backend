import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPackageDto {
  @ApiPropertyOptional({ description: 'Search by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by destination ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  destinationId?: number;

  @ApiPropertyOptional({ description: 'Filter by best season' })
  @IsOptional()
  @IsString()
  bestSeason?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by activity type' })
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional({ description: 'Sort by field', enum: ['price', 'rating', 'createdAt', 'title'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
