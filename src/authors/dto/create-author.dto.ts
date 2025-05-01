import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  bio: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  profilePicture: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  socialLinks: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;
}
