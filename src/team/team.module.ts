import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team } from 'src/database/entities/team.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Team])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
