import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(4, { message: 'O título deve conter pelo menos 4 caracteres' })
  title: string;

  @IsString()
  @MinLength(10, {
    message: 'A descrição deve conter pelo menos 10 caracteres',
  })
  description?: string;
}
