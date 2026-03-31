import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDTO } from '../dto/task.dto';
import { Task } from '../schema/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
  ) {}

  async create(dto: CreateTaskDTO, userId: string): Promise<Task> {
    const newTask = new this.taskModel({
      ...dto,
      userId,
    });

    return newTask.save();
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }
}
