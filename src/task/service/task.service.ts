import { Injectable, NotFoundException } from '@nestjs/common';
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

  async toggleStatus(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: taskId, userId });

    if (!task) {
      throw new NotFoundException(
        'Tarefa não encontrada ou você não tem permissão',
      );
    }

    task.isCompleted = !task.isCompleted;
    return task.save();
  }

  async remove(taskId: string, userId: string) {
    const result = await this.taskModel.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Tarefa não encontrada ou você não tem permissão',
      );
    }

    return { message: 'Tarefa removida com sucesso' };
  }
}
