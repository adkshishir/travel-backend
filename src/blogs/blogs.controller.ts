import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationDto } from 'src/utils/pagination.dto';

@ApiTags('Blogs')
@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogsService.findAll(paginationDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a blog by slug' })
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update a blog by slug' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(@Param('slug') slug: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a blog by slug' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('slug') slug: string) {
    return this.blogsService.remove(slug);
  }
} 