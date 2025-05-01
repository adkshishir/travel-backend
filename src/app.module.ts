import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { DestinationsModule } from './destinations/destinations.module';
import { PackagesModule } from './packages/packages.module';
import { SiteInfoModule } from './site-info/site-info.module';
import { BookingModule } from './booking/booking.module';
import { CarouselsModule } from './carousels/carousels.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [
    UploadModule,
    PrismaModule,
    ActivitiesModule,
    DestinationsModule,
    AuthModule,
    CarouselsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your uploads folder
      serveRoot: '/uploads', // URL prefix for static files
    }),
    PackagesModule,
    SiteInfoModule,
    BookingModule,
    ReviewsModule,
    FaqModule,
    // SeoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
