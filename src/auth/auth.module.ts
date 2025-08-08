import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { MailerService } from 'src/mail/mailer.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, MailerService],
})
export class AuthModule {}
