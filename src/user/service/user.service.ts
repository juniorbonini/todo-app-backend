/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { RegisterDTO } from '@/auth/dto/register.dto';
import { ApiSuccessResponse } from '@/interfaces/api-response';
import { successResponse } from '@/scripts/api-response';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { updateUserDTO, UserResponseDTO } from '../dto/user.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  toResponseDTO(user: UserDocument): UserResponseDTO {
    return new UserResponseDTO(user);
  }

  private parseBirthDate(birthDate: string): Date {
    const [day, month, year] = birthDate.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  }

  private async findByIdOrThrow(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findByEmailOrThrow(email: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException({
        status: 'error',
        message: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND',
      });
    }

    return user;
  }

  async findById(
    id: string,
  ): Promise<ApiSuccessResponse<{ user: UserResponseDTO }>> {
    const user = await this.findByIdOrThrow(id);

    return successResponse('Usuário encontrado com sucesso', 'USER_LOADED', {
      user: this.toResponseDTO(user),
    });
  }

  async findAll(): Promise<ApiSuccessResponse<{ user: UserResponseDTO[] }>> {
    const users = await this.userModel.find();

    return successResponse(
      'Usuários carregados com sucesso',
      'USER_LIST_LOADED',
      {
        user: users.map((user) => this.toResponseDTO(user)),
      },
    );
  }

  async crete(
    dto: RegisterDTO,
  ): Promise<ApiSuccessResponse<{ user: UserResponseDTO }>> {
    const { password, confirmPassword, birthDate, ...userData } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException({
        status: 'error',
        message: 'As senhas não coincidem',
        code: 'PASSWORDS_DO_NOT_MATCH',
        field: 'confirmPassword',
      });
    }

    const parsedBirthDate = this.parseBirthDate(birthDate);
    const age = this.calculateAge(parsedBirthDate);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        ...userData,
        birthDate: parsedBirthDate,
        age,
        password: hashedPassword,
        isVerified: false,
      });

      return successResponse(
        'Usuário criado com suecesso',
        'AUTH_REGISTER_SUCCESS',
        {
          user: this.toResponseDTO(user),
        },
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException({
          status: 'error',
          message: 'O e-mail já está em uso',
          code: 'USER_EMAIL_IN_USE',
          field: 'email',
        });
      }
      throw error;
    }
  }

  async update(
    dto: updateUserDTO,
    userId: string,
  ): Promise<ApiSuccessResponse<{ user: UserResponseDTO }>> {
    await this.findByIdOrThrow(userId);

    try {
      const user = await this.userModel.findByIdAndUpdate(userId, dto, {
        new: true,
      });
      return successResponse('Usuário atualizado com sucesso', 'USER_UPDATED', {
        user: this.toResponseDTO(user!),
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException({
          status: 'error',
          message: 'O e-mail já está em uso',
          code: 'USER_EMAIL_IN_USE',
          field: 'email',
        });
      }
      throw error;
    }
  }

  async updateReseCode(
    id: string,
    code: string | null,
    expires: Date | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      resetCode: code,
      resetCodeExpires: expires,
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      password: newPassword,
    });
  }

  async delete(id: string): Promise<ApiSuccessResponse<object>> {
    await this.findByIdOrThrow(id);
    await this.userModel.findByIdAndDelete(id);

    return successResponse('Usuário removido com sucesso', 'USER_REMOVED', {});
  }
}
