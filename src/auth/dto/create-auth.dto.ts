import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '98xxxx' })
  phone: string;
}

export class VerfiyRegisterDto {
  @ApiProperty({ example: '98xxxx' })
  phone: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}

export class EmailRegisterDto {
  @ApiProperty({ example: 'john@gmail.com' })
  email: string;
}
export class VerfiyEmailRegisterDto {
  @ApiProperty({ example: ' john@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}

export class UpdateUserDto{
  @ApiProperty({ example: '98xxxx' })
  phone: string;
  @ApiProperty({ example: 'john@gmail.com' })
  email: string;
  
}