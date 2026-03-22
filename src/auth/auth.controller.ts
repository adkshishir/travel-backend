import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  CreateAdminDto,
  EmailRegisterDto,
  VerfiyEmailRegisterDto,
} from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  emailAuth(@Body() registerDto: EmailRegisterDto) {
    return this.authService.emailAuth(registerDto);
  }

  @Post('verify')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  emailAuthVerify(@Body() verifyRegisterDto: VerfiyEmailRegisterDto) {
    return this.authService.emailAuthVerify(verifyRegisterDto);
  }

  @Post('init-admins')
  @Throttle({ short: { limit: 1, ttl: 60000 } })
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
