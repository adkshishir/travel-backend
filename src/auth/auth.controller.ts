import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  EmailRegisterDto,
  VerfiyEmailRegisterDto,
} from './dto/create-auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  emailAuth(@Body() registerDto: EmailRegisterDto) {
    return this.authService.emailAuth(registerDto);
  }
  @Post('verify')
  emailAuthVerify(@Body() verifyRegisterDto: VerfiyEmailRegisterDto) {
    return this.authService.emailAuthVerify(verifyRegisterDto);
  }
}
