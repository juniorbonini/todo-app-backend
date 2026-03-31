/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/jwt/jwt-auth.guard';
import { RegisterDTO } from '@/auth/dto/register.dto';
import { UserService } from '@/user/service/user.service';
import { CreateUserDTO, UpdateUserDTO } from '@/user/dto/user.dto';
import { currentUser } from '@/auth/decorators/current-user.decoratos';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrent(@currentUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.userService.update(id, dto);
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.userService.register(registerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
