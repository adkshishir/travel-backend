import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a blog by slug' })
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update a blog by slug' })
  update(@Param('slug') slug: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(slug, updateBlogDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a blog by slug' })
  remove(@Param('slug') slug: string) {
    return this.blogsService.remove(slug);
  }
} 