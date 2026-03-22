import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/pagination.dto';

@ApiTags('Contact Messages')
@Controller('api/mail')
export class MailController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact form message' })
  @ApiResponse({ status: 201, description: 'Contact message sent successfully' })
  @ApiResponse({ status: 500, description: 'Failed to send contact message' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiResponse({ status: 200, description: 'All contact messages retrieved successfully' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contactService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact message by ID' })
  @ApiResponse({ status: 200, description: 'Contact message retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact message' })
  @ApiResponse({ status: 200, description: 'Contact message updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message' })
  @ApiResponse({ status: 200, description: 'Contact message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
} 