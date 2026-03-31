/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { currentUser } from '@/auth/decorators/current-user.decoratos';
import { JwtAuthGuard } from '@/jwt/jwt-auth.guard';
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
import { CreateTaskDTO } from '../dto/task.dto';
import { Task } from '../schema/task.schema';
import { TaskService } from '../service/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDTO, @currentUser() user: any) {
    return this.taskService.create(dto, user.userId);
  }

  @Get()
  findAllByUserId(@currentUser() user: any): Promise<Task[]> {
    return this.taskService.findAllByUserId(user.userId);
  }

  @Get('stats')
  async getStats(@currentUser() user: any) {
    return this.taskService.getTaskStats(user);
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @currentUser() user: any) {
    return this.taskService.toggleStatus(id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @currentUser() user: any) {
    return this.taskService.remove(id, user);
  }
}
