/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDocument } from '../schemas/user.schema';

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
  age: number;
  isVerified: boolean;
  createdAt?: Date;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.birthDate = user.birthDate;
    this.gender = user.gender;
    this.age = user.age;
    this.isVerified = user.isVerified;
    this.createdAt = (user as any).createdAt;
  }
}
export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name?: string;
}
