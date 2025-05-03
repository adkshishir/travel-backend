import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  CreateAdminDto,
  EmailRegisterDto,
  VerfiyEmailRegisterDto,
} from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Create } from 'sharp';

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
  @Post('init-admins')
  initAdmins() {
    return this.authService.initAdmins();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('create-admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdmin(createAdminDto);
  }
}
