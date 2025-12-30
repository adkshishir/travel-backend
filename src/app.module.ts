import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { BlogsModule } from './blogs/blogs.module';
import { AuthorsModule } from './authors/authors.module';
import { MailModule } from './mail/mail.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UploadModule,
    ActivitiesModule,
    DestinationsModule,
    PackagesModule,
    CarouselsModule,
    ReviewsModule,
    FaqModule,
    BlogsModule,
    AuthorsModule,
    SiteInfoModule,
    BookingModule,
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
