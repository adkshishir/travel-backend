import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsInt, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Experienced travel writer and blogger', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://johndoe.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: 'author', enum: ['author', 'editor', 'contributor', 'guest'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['author', 'editor', 'contributor', 'guest'])
  role?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;

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

  @ApiProperty({ description: 'Social media links and profiles' })
  @IsOptional()
  socialLinks?: any;
}
