/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Body, Delete, Injectable } from '@nestjs/common';

import { CreateUserDTO, UserResponseDTO } from '@/user/dto/user.dto';
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

  async findAll() {
    return this.userModel.find();
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, @Body() dto: CreateUserDTO) {
    return this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  @Delete()
  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
