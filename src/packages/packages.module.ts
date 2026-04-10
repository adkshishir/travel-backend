import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from 'src/database/entities/package.entity';
import { Media } from 'src/database/entities/media.entity';
import { Seo } from 'src/database/entities/seo.entity';
import { Faq } from 'src/database/entities/faq.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Package, Media, Seo, Faq]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
