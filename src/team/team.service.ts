import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import responseHelper from 'src/utils/response-helper';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from 'src/database/entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async create(dto: CreateTeamDto) {
    const member = this.teamRepo.create(dto);
    await this.teamRepo.save(member);
    const full = await this.teamRepo.findOne({
      where: { id: member.id },
      relations: ['Media'],
    });
    return responseHelper.success('Team member created', full);
  }

  async findAll() {
    const members = await this.teamRepo.find({
      relations: ['Media'],
      order: { createdAt: 'ASC' },
    });
    return responseHelper.success('Team members fetched', members);
  }

  async findOne(id: number) {
    const member = await this.teamRepo.findOne({
      where: { id },
      relations: ['Media'],
    });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    return responseHelper.success('Team member fetched', member);
  }

  async update(id: number, dto: UpdateTeamDto) {
    const member = await this.teamRepo.findOne({ where: { id } });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    Object.assign(member, dto);
    await this.teamRepo.save(member);
    const updated = await this.teamRepo.findOne({
      where: { id },
      relations: ['Media'],
    });
    return responseHelper.success('Team member updated', updated);
  }

  async remove(id: number) {
    const member = await this.teamRepo.findOne({ where: { id } });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    await this.teamRepo.remove(member);
    return responseHelper.success('Team member deleted');
  }
}
