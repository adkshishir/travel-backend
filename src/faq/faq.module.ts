import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { Faq } from 'src/database/entities/faq.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
