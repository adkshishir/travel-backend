import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { SanitizePipe } from './utils/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Security headers
  app.use(helmet());

  const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.enableCors(corsOptions);
  const config = new DocumentBuilder()
    .setTitle('Travel Api')
    .setDescription('The Travel API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new SanitizePipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      exceptionFactory: (errors) => {
        if (!Array.isArray(errors)) {
          return new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
          });
        }
        // Create an object to hold the formatted errors
        const formattedErrors = errors.reduce((acc, error) => {
          // Check if the error has children
          if (error.children && error.children.length > 0) {
            // Initialize the property in the accumulator
            acc[error.property] = acc[error.property] || {};

            // Populate the errors for each child
            error.children.forEach((childError) => {
              acc[error.property][childError.property] = Object.values(
                childError.constraints,
              );
            });
          } else {
            // If no children, just push the constraints to the property directly
            acc[error.property] = Object.values(error.constraints);
          }
          return acc;
        }, {}); // Start with an empty object

        return new BadRequestException({
          statusCode: 400,
          status: 'failure',
          message: 'Bad request', // Return the formatted errors as an object
          error: formattedErrors,
        });
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
