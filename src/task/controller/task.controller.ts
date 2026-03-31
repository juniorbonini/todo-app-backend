/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDTO } from '../dto/task.dto';
import { currentUser } from '@/auth/decorators/current-user.decoratos';
import { TaskService } from '../service/task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDTO, @currentUser() user: any) {
    return this.taskService.create(dto, user.userId);
  }

  @Get()
  findAll(@currentUser() user: any) {
    return this.taskService.findAll(user.userId);
  }
}
