import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { TaskService } from '@/task/service/task.service';
import type { ActiveUser } from '@/interfaces/active.user';
import { CreateTaskDTO, UpdateTaskDTO } from '@/task/dto/task.dto';
import { currentUser } from '@/auth/decorators/current.user.decoratos';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDTO, @currentUser() user: ActiveUser) {
    return this.taskService.create(dto, user.id);
  }

  @Get()
  findAll(@currentUser() user: ActiveUser) {
    return this.taskService.findByUserId(user.id);
  }

  @Get('stats')
  getStats(@currentUser() user: ActiveUser) {
    return this.taskService.getTasksStats(user.id);
  }

  @Put(':id')
  update(
    @Body() dto: UpdateTaskDTO,
    @currentUser() user: ActiveUser,
    @Param('id') id: string,
  ) {
    return this.taskService.update(user.id, id, dto);
  }

  @Patch('id')
  toggle(@Param('id') id: string, @currentUser() user: ActiveUser) {
    return this.taskService.toggleStatus(id, user.id);
  }

  @Delete(':id')
  delete(@Param() id: string, @currentUser() user: ActiveUser) {
    return this.taskService.remove(id, user.id);
  }
}
