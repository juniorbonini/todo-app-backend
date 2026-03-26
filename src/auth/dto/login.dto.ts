import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
