import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSeoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  metaKeywords?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  mediaId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  metaCanonical?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  schema?: string;

  // @IsOptional()
  // @IsInt()
  // @ApiProperty()
  // blogId?: number;

  // @IsOptional()
  // @ApiProperty()
  // @IsInt()
  // packageId?: number;

  // @IsOptional()
  // @ApiProperty()
  // @IsInt()
  // activityId?: number;

  // @IsOptional()
  // @IsInt()
  // @ApiProperty()
  // destinationId?: number;

  // @IsOptional()
  // @IsInt()
  // @ApiProperty()
  // authorId?: number;
}
