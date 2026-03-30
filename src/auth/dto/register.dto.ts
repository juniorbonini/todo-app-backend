import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsDate, IsNumber } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'O E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;

  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida' })
  birthDate: Date;

  @IsNotEmpty({ message: 'O gênero é obrigatório' })
  gender: string;

  @IsNotEmpty({ message: 'A idade é obrigatória' })
  @IsNumber({}, { message: 'Idade inválida' })
  @Type(() => Number)
  age: number;
}
