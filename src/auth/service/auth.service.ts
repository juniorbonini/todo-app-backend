/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { successResponse } from '@/scripts/api-response';
import { UserService } from '@/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Credenciais inválidas.',
        code: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Credenciais inválidas.',
        code: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const payload = {
      email: user?.email,
      sub: user?._id.toString(),
    };

    return successResponse('Login realizado com sucesso.', 'AUTH_LOGIN_SUCCESS', {
      token: this.jwtService.sign(payload),
      user: this.userService.toResponseDTO(user),
    });
  }
}
