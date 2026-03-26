/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Delete, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '@/user/dto/user.dto';

@Injectable()
export class UserService {
  create(@Body() dto: CreateUserDTO) {
    return {
      id: '1',
      ...dto,
      createdAt: new Date(),
    };
  }

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

  findById(id: string) {
    return {
      id,
      name: 'Lua Bonini',
      email: 'luabonini@email.com',
    };
  }

  findByEmail(email: string) {
    return {
      id: '1',
      name: 'Junior Bonini',
      email,
    };
  }

  update(id: string, @Body() dto: CreateUserDTO) {
    return {
      id,
      ...dto,
      updatedAt: new Date(),
    };
  }

  @Delete()
  delete(id: string) {
    return {
      message: `Usuário ${id} removido com sucesso`,
    };
  }
}
