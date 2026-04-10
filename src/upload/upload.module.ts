import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Media } from 'src/database/entities/media.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Media])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
