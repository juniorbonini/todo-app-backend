/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

export class VerifyCodeDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'O código é obrigatório' })
  @MinLength(6, { message: 'O código deve ter exatamente 6 dígitos' })
  code: string;
}
