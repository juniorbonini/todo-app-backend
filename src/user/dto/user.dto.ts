/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserDocument } from '../schemas/user.schema';

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

  constructor(user: UserDocument) {
    ((this.id = user._id.toString()),
      (this.name = user.name),
      (this.email = user.email));
  }
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password?: string;
}
