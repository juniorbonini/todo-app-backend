import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { successResponse } from '@/scripts/api-response';
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

    const savedTask = await newTask.save();

    return successResponse('Tarefa criada com sucesso.', 'TASK_CREATED', {
      task: savedTask,
    }) as unknown as Task;
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ userId }).exec();

    return successResponse('Tarefas carregadas com sucesso.', 'TASKS_LISTED', {
      tasks,
    }) as unknown as Task[];
  }

  async toggleStatus(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: taskId, userId });

    if (!task) {
      throw new NotFoundException({
        status: 'error',
        message: 'Tarefa não encontrada ou você não tem permissão.',
        code: 'TASK_NOT_FOUND',
      });
    }

    task.isCompleted = !task.isCompleted;
    const updatedTask = await task.save();

    return successResponse(
      'Status da tarefa atualizado com sucesso.',
      'TASK_UPDATED',
      { task: updatedTask },
    ) as unknown as Task;
  }

  async remove(taskId: string, userId: string) {
    const result = await this.taskModel.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new NotFoundException({
        status: 'error',
        message: 'Tarefa não encontrada ou você não tem permissão.',
        code: 'TASK_NOT_FOUND',
      });
    }

    return successResponse('Tarefa removida com sucesso.', 'TASK_REMOVED', {});
  }

  async getTaskStats(userId: string) {
    const totalCreated = await this.taskModel.countDocuments({ userId });
    const totalCompleted = await this.taskModel.countDocuments({
      userId,
      isCompleted: true,
    });

    return successResponse(
      'Resumo das tarefas carregado com sucesso.',
      'TASK_STATS_LISTED',
      {
        stats: [
          { type: 'created', value: totalCreated },
          { type: 'completd', value: totalCompleted },
        ],
      },
    );
  }
}
