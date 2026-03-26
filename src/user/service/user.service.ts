/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Body, Delete, Injectable } from '@nestjs/common';

import { CreateUserDTO } from '@/user/dto/user.dto';
import { User, UserDocument } from '@/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDTO) {
    const user = await this.userModel.create(dto);
    console.log('DATA: ', dto);
    return user;
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
