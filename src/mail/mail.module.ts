import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ContactService } from './contact.service';
import { MailController } from './mail.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MailController],
  providers: [MailerService, ContactService],
  exports: [MailerService, ContactService],
})
export class MailModule {} 