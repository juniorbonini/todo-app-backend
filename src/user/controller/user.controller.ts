import { Body, Controller, Delete, Get, Put } from '@nestjs/common';

import { UpdateUserDTO } from '@/user/dto/user.dto';
import { UserService } from '@/user/service/user.service';
import type { ActiveUser } from '@/interfaces/active.user';
import { currentUser } from '@/auth/decorators/current.user.decoratos';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@currentUser() user: ActiveUser) {
    return this.userService.findById(user.id);
  }

  @Put('me')
  updateMe(@currentUser() user: ActiveUser, @Body() dto: UpdateUserDTO) {
    return this.userService.update(dto, user.id);
  }

  @Delete('me')
  deleteMe(@currentUser() user: ActiveUser) {
    return this.userService.delete(user.id);
  }
}
