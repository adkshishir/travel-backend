import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author } from 'src/database/entities/author.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
