/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMailserviceDto } from '../dto/create-mailservice.dto';
import { UpdateMailserviceDto } from '../dto/update-mailservice.dto';
import { MailService } from '../service/mail.service';

@Controller('mailservice')
export class MailserviceController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  create(@Body() createMailserviceDto: CreateMailserviceDto) {
    return this.mailService.create(createMailserviceDto);
  }

  @Get()
  findAll() {
    return this.mailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMailserviceDto: UpdateMailserviceDto,
  ) {
    return this.mailService.update(+id, updateMailserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailService.remove(+id);
  }
}
