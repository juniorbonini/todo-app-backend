/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'O código é obrigatório' })
  @Length(6, 6, { message: 'O código deve conter exatamente 6 caracteres' })
  code: string;

  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(8, { message: 'A nova senha deve conter no mínimo 8 caracteres' })
  newPassword: string;
}
