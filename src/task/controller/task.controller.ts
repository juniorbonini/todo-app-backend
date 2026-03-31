import { currentUser } from '@/auth/decorators/current.user.decoratos';
import { JwtAuthGuard } from '@/jwt/jwt.auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import type { ActiveUser } from '@/interfaces/active.user';
import { CreateTaskDTO } from '@/task/dto/task.dto';
import { Task } from '@/task/schema/task.schema';
import { TaskService } from '@/task/service/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDTO, @currentUser() user: ActiveUser) {
    return this.taskService.create(dto, user.id);
  }

  @Get()
  findAllByUserId(@currentUser() user: ActiveUser): Promise<Task[]> {
    return this.taskService.findAllByUserId(user.id);
  }

  @Get('stats')
  async getStats(@currentUser() user: ActiveUser) {
    return this.taskService.getTaskStats(user.id);
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @currentUser() user: ActiveUser) {
    return this.taskService.toggleStatus(id, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @currentUser() user: ActiveUser) {
    return this.taskService.remove(id, user.id);
  }
}
