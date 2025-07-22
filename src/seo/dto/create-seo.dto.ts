import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return parseInt(value);
  })
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
