import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ALL_ENTITIES } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        url: config.get<string>('DATABASE_URL'),
        entities: ALL_ENTITIES,
        synchronize: true,
        logging: false,
        relationLoadStrategy: 'query',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
