import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { Newsletter } from 'src/database/entities/newsletter.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Newsletter])],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
