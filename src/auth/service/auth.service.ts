import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDTO } from '@/auth/dto/login.dto';
import { successResponse } from '@/scripts/api-response';
import { UserService } from '@/user/service/user.service';
import { MailService } from '@/mailservice/service/mailservice.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findByEmail(loginDTO.email);

    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Credenciais inválidas.',
        code: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

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

    return successResponse(
      'Login realizado com sucesso.',
      'AUTH_LOGIN_SUCCESS',
      {
        token: this.jwtService.sign(payload),
        user: this.userService.toResponseDTO(user),
      },
    );
  }

  async generateForgotPasswordCode(email: string) {
    const user = await this.userService.findByEmail(email);

    const code = randomInt(100000, 999999).toString();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.userService.updateResetCode(user?._id.toString(), code, expires);

    await this.mailService.sendVerificationCode(email, code);

    return successResponse(
      'Código enviado para o e-mail',
      'AUTH_CODE_SENT',
      {},
    );
  }
}
