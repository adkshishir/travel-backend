import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateActivityDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  slug: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  mediaId?: number;
  @ApiProperty()
  seo?: CreateSeoDto;
}
