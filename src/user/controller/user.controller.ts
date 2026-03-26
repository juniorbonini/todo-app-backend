import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/user.dto';

@Controller('user')
export class UserController {
  @Post('/users')
  create(@Body() dto: CreateUserDTO) {
    return {
      id: '1',
      ...dto,
      createdAt: new Date(),
    };
  }

  @Get()
  findAll() {
    return [
      {
        id: '1',
        name: 'Junior Bonini',
        email: 'juniorbonini@email.com',
      },
      {
        id: '2',
        name: 'Lua Bonini',
        email: 'luabonini@email.com',
      },
    ];
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return {
      id,
      name: 'Lua Bonini',
      email: 'luabonini@email.com',
    };
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return {
      id: '1',
      name: 'Junior Bonini',
      email,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateUserDTO) {
    return {
      id,
      ...dto,
      updatedAt: new Date(),
    };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return {
      message: `Usuário ${id} removido com sucesso`,
    };
  }
}
