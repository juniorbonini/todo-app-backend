import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { TaskPriority } from '../schema/task.schema';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(4, { message: 'O título deve conter pelo menos 4 caracteres' })
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'A descrição deve conter pelo menos 10 caracteres',
  })
  description?: string;

  @IsEnum(['low', 'medium', 'high'], {
    message: 'A prioridade deve ser: low, medium ou high',
  })
  priority: TaskPriority;

  @IsInt({ message: 'O limite de tempo deve ser um número inteiro' })
  @Min(1, { message: 'O limite de tempo deve ser pelo menos 1 minuto' })
  timeLimit: number;
}

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;
}
