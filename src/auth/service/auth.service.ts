import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

import { LoginDTO } from '@/auth/dto/login.dto';
import { MailService } from '@/mailservice/service/mail.service';
import { successResponse } from '@/scripts/api-response';
import { UserService } from '@/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async verifyCode(email: string, code: string) {
    const user = await this.userService.findByEmailOrThrow(email);

    if (user.resetCode !== code || new Date() > user.resetCodeExpires) {
      throw new BadRequestException({
        status: 'error',
        message: 'Código inválido ou expirado.',
        code: 'AUTH_INVALID_RESET_CODE',
      });
    }

    return successResponse(
      'Código validado com sucesso.',
      'AUTH_CODE_VALID',
      {},
    );
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userService.findByEmailOrThrow(email);

    if (user.resetCode !== code || new Date() > user.resetCodeExpires) {
      throw new BadRequestException({
        status: 'error',
        message: 'Código inválido ou expirado',
        code: 'AUTH_INVALID_RESET_CODE',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userService.updatePassword(user._id.toString(), hashedPassword);
    await this.userService.updateResetCode(user._id.toString(), null, null);

    return successResponse(
      'Senha alterada com sucesso',
      'AUTH_PASSWORD_RESET',
      {},
    );
  }
  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return successResponse(
        'Se o e-mail existir o código será enviado!',
        'AUTH_SENT_CODE',
        {},
      );
    }

    const code = randomInt(100000 * 90000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.userService.updateResetCode(user._id.toString(), code, expires);
    await this.mailService.sendVerificationCode(email, code);

    return successResponse('Código enviado com sucesso!', 'AUTH_SENT_CODE', {});
  }

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
