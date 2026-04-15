/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { RegisterDTO } from '@/auth/dto/register.dto';
import type { ApiSuccessResponse } from '@/interfaces/api-response';
import { successResponse } from '@/scripts/api-response';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '@/user/dto/user.dto';
import { User, UserDocument } from '@/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public toResponseDTO(user: UserDocument): UserResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  private parseBirthDate(birthDate: string) {
    const [day, month, year] = birthDate.split('/').map(Number);

    return new Date(year, month - 1, day);
  }

  private calculateAge(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  }

  async create(dto: CreateUserDTO) {
    try {
      const user = await this.userModel.create(dto);

      return successResponse('Usuário criado com sucesso.', 'USER_CREATED', {
        user: this.toResponseDTO(user),
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException({
          status: 'error',
          message: 'E-mail já está em uso.',
          code: 'USER_EMAIL_IN_USE',
          field: 'email',
        });
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const user = await this.userModel.find();

    return successResponse('Usuários carregados com sucesso.', 'USERS_LISTED', {
      users: user.map((currentUser) => this.toResponseDTO(currentUser)),
    }) as unknown as UserResponseDTO[];
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        status: 'error',
        message: 'Usuário não encontrado.',
        code: 'USER_NOT_FOUND',
      });
    }

    return successResponse('Usuário carregado com sucesso.', 'USER_FETCHED', {
      user: new UserResponseDTO(user),
    }) as unknown as UserResponseDTO;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findByEmailOrThrow(email: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException({
        status: 'error',
        message: 'Usuário não encontrado.',
        code: 'USER_NOT_FOUND',
      });
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!user) {
        throw new NotFoundException({
          status: 'error',
          message: 'Usuário não encontrado.',
          code: 'USER_NOT_FOUND',
        });
      }

      return successResponse(
        'Usuário atualizado com sucesso.',
        'USER_UPDATED',
        { user: new UserResponseDTO(user) },
      ) as unknown as UserResponseDTO;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException({
          status: 'error',
          message: 'E-mail já está em uso.',
          code: 'USER_EMAIL_IN_USE',
          field: 'email',
        });
      }
      return error;
    }
  }

  async updateResetCode(id: string | undefined, code: string, expires: Date) {
    await this.userModel.findByIdAndUpdate(id, {
      resetCode: code,
      resetCodeExpires: expires,
    });
  }

  async register(
    registerDTO: RegisterDTO,
  ): Promise<ApiSuccessResponse<{ user: UserResponseDTO }>> {
    const { password, confirmPassword, birthDate, ...userData } = registerDTO;

    if (password !== confirmPassword) {
      throw new BadRequestException({
        status: 'error',
        message: 'As senhas não coincidem.',
        code: 'USER_PASSWORD_MISMATCH',
        field: 'confirmPassword',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const parsedBirthDate = this.parseBirthDate(birthDate);
    const age = this.calculateAge(parsedBirthDate);

    try {
      const user = new this.userModel({
        ...userData,
        birthDate: parsedBirthDate,
        age,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      return successResponse(
        'Cadastro realizado com sucesso.',
        'AUTH_REGISTER_SUCCESS',
        { user: new UserResponseDTO(savedUser) },
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException({
          status: 'error',
          message: 'E-mail já está em uso.',
          code: 'USER_EMAIL_IN_USE',
          field: 'email',
        });
      }
      throw error;
    }
  }

  async delete(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException({
        status: 'error',
        message: 'Usuário não encontrado.',
        code: 'USER_NOT_FOUND',
      });
    }

    return successResponse('Usuário removido com sucesso.', 'USER_REMOVED', {});
  }
}
