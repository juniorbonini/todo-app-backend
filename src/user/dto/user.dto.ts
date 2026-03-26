import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;
}

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
}
