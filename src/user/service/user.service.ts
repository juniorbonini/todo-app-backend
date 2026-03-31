/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  private responseDTO(user: any): UserResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  async create(dto: CreateUserDTO) {
    try {
      const user = await this.userModel.create(dto);

      return this.responseDTO(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('E-mail já está em uso.');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const user = await this.userModel.find();

    return user.map((user) => this.responseDTO(user));
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return new UserResponseDTO(user);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      return new UserResponseDTO(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('E-mail já está em uso.');
      }
      return error;
    }
  }

  async register(registerDTO: RegisterDTO): Promise<UserResponseDTO> {
    const { password, confirmPassword, ...userData } = registerDTO;

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = new this.userModel({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      return new UserResponseDTO(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('E-mail já está em uso.');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
