import { Controller, Get, Patch, Delete, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'filter', required: false, enum: ['pending', 'approved', 'spam'] })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('filter') filter?: string,
  ) {
    return this.commentsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      filter,
    );
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.reject(id);
  }

  @Patch(':id/spam')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  markSpam(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.markSpam(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
