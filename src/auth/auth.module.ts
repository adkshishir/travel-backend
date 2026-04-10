import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { User } from 'src/database/entities/user.entity';
import { MailerService } from 'src/mail/mailer.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'dev-secret',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, MailerService],
  exports: [TypeOrmModule, JwtModule, AuthGuard],
})
export class AuthModule {}
