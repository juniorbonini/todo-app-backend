import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { currentUser } from '@/auth/decorators/current.user.decoratos';
import { RegisterDTO } from '@/auth/dto/register.dto';
import type { ActiveUser } from '@/interfaces/active.user';
import { JwtAuthGuard } from '@/jwt/jwt.auth.guard';
import { successResponse } from '@/scripts/api-response';
import { CreateUserDTO, UpdateUserDTO } from '@/user/dto/user.dto';
import { UserService } from '@/user/service/user.service';

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
  getCurrent(@currentUser() user: ActiveUser) {
    return successResponse(
      'Usuário autenticado carregado com sucesso.',
      'USER_CURRENT_FETCHED',
      {
        user,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmailOrThrow(email);
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
