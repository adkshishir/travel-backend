import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import responseHelper from 'src/utils/response-helper';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    const member = await this.prisma.team.create({
      data: dto,
      include: { Media: true },
    });
    return responseHelper.success('Team member created', member);
  }

  async findAll() {
    const members = await this.prisma.team.findMany({
      include: { Media: true },
      orderBy: { createdAt: 'asc' },
    });
    return responseHelper.success('Team members fetched', members);
  }

  async findOne(id: number) {
    const member = await this.prisma.team.findUnique({
      where: { id },
      include: { Media: true },
    });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    return responseHelper.success('Team member fetched', member);
  }

  async update(id: number, dto: UpdateTeamDto) {
    const member = await this.prisma.team.findUnique({ where: { id } });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    const updated = await this.prisma.team.update({
      where: { id },
      data: dto,
      include: { Media: true },
    });
    return responseHelper.success('Team member updated', updated);
  }

  async remove(id: number) {
    const member = await this.prisma.team.findUnique({ where: { id } });
    if (!member) throw new NotFoundException(responseHelper.error('Team member not found'));
    await this.prisma.team.delete({ where: { id } });
    return responseHelper.success('Team member deleted');
  }
}
