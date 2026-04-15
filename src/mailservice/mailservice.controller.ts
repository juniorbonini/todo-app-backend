import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';
import { CreateMailserviceDto } from './dto/create-mailservice.dto';
import { UpdateMailserviceDto } from './dto/update-mailservice.dto';

@Controller('mailservice')
export class MailserviceController {
  constructor(private readonly mailserviceService: MailserviceService) {}

  @Post()
  create(@Body() createMailserviceDto: CreateMailserviceDto) {
    return this.mailserviceService.create(createMailserviceDto);
  }

  @Get()
  findAll() {
    return this.mailserviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailserviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailserviceDto: UpdateMailserviceDto) {
    return this.mailserviceService.update(+id, updateMailserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailserviceService.remove(+id);
  }
}
