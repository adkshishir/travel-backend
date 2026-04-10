import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from './mailer.service';
import { ContactService } from './contact.service';
import { MailController } from './mail.controller';
import { Mail } from 'src/database/entities/mail.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Mail])],
  controllers: [MailController],
  providers: [MailerService, ContactService],
  exports: [MailerService, ContactService],
})
export class MailModule {}
