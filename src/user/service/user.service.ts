/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Body,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '@/user/dto/user.dto';
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

  async findByEmail(email: string) {
    const userExists = await this.userModel.findOne({ email });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return userExists;
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return new UserResponseDTO(user);
  }

  @Delete()
  async delete(id: string) {
    const userExists = await this.userModel.findByIdAndDelete(id);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
