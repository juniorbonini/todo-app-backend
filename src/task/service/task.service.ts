/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiSuccessResponse } from '@/interfaces/api-response';
import { successResponse } from '@/scripts/api-response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';
import { Task, TaskDocument, xpTaskByPriority } from '../schema/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  private async findByAnUser(
    taskId: string,
    userId: string,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({ _id: taskId, userId }).exec();

    if (!task) {
      throw new NotFoundException({
        status: 'error',
        message: 'Tarefa não encontrada ou você não tem permissão',
        code: 'TASK_NOT_FOUND',
      });
    }
    return task;
  }

  private calculateXpEarned(task: TaskDocument, completedAt: Date): number {
    const xpBase = xpTaskByPriority[task.priority];
    const createdAt = (task as any).createdAt as Date;
    const timeLimitMs = task.timeLimit * 60 * 1000;
    const timeUsedMs = completedAt.getTime() - createdAt.getTime();
    const timeLeftMs = timeLimitMs - timeUsedMs;

    if (timeLeftMs > 0) {
      const bonusXp = Math.floor((timeLeftMs / timeLimitMs) * xpBase);
      return xpBase + bonusXp;
    }

    return xpBase;
  }

  async create(
    dto: CreateTaskDTO,
    userId: string,
  ): Promise<ApiSuccessResponse<{ task: TaskDocument }>> {
    const task = await this.taskModel.create({ ...dto, userId });

    return successResponse('Tarefa criada com sucesso', 'TASK_CREATED', {
      task,
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<ApiSuccessResponse<{ tasks: TaskDocument[] }>> {
    const tasks = await this.taskModel.find({ userId }).sort({ createdAt: -1 });

    return successResponse('Tarefas carregadas com sucesso', 'TASKS_LISTED', {
      tasks,
    });
  }

  async update(
    taskId: string,
    userId: string,
    dto: UpdateTaskDTO,
  ): Promise<ApiSuccessResponse<{ task: TaskDocument }>> {
    await this.findByAnUser(taskId, userId);

    const task = await this.taskModel.findByIdAndUpdate(taskId, dto, {
      new: true,
    });

    return successResponse('Tarefa atualizada com sucesso', 'TASK_UPDATED', {
      task: task!,
    });
  }

  async toggleStatus(
    taskId: string,
    userId: string,
  ): Promise<ApiSuccessResponse<{ task: TaskDocument; xpEarned?: number }>> {
    const task = await this.findByAnUser(taskId, userId);

    const isCompleting = !task.isCompleted;
    const completedAt = isCompleting ? new Date() : null;
    const xpEarned =
      isCompleting && completedAt
        ? this.calculateXpEarned(task, completedAt)
        : null;

    task.isCompleted = isCompleting;
    task.completedAt = completedAt;
    task.xpEarned = xpEarned;

    const updatedTask = await task.save();

    return successResponse(
      isCompleting ? 'Tarefa concluída' : 'Tarefa aberta',
      'TASK_TOGGLE_STATUS',
      {
        task: updatedTask,
        xpEarned: xpEarned ?? undefined,
      },
    );
  }

  async remove(
    taskId: string,
    userId: string,
  ): Promise<ApiSuccessResponse<object>> {
    await this.findByAnUser(taskId, userId);

    await this.taskModel.findByIdAndDelete(taskId);

    return successResponse('Tarefa removida com sucesso', 'TASK_REMOVED', {});
  }

  async getTasksStats(userId: string) {
    const [totalCreated, totalCompleted] = await Promise.all([
      this.taskModel.countDocuments({ userId }),
      this.taskModel.countDocuments({ userId, isCompletd: true }),
    ]);

    return successResponse(
      'Resumo de tarefa carregado com sucesso',
      'TASKS_STATS_LISTED',
      {
        stats: {
          total: totalCreated,
          completed: totalCompleted,
          pending: totalCreated - totalCompleted,
        },
      },
    );
  }
}
