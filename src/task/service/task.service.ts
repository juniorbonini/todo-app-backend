import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '../dto/task.dto';

@Injectable()
export class TaskService {

  create(dto: CreateTaskDTO, userId: string) {

  }

  findAll(userId: string) {
    
  }
}
