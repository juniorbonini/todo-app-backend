import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { LoginDTO } from '@/auth/dto/login.dto';
import { MailService } from '@/mailservice/service/mail.service';
import { successResponse } from '@/scripts/api-response';
import { UserDocument } from '@/user/schemas/user.schema';
import { UserService } from '@/user/service/user.service';
import { randomInt } from 'crypto';
import { RegisterDTO } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  private validateResetCode(user: UserDocument, code: string): void {
    const isCodeMatch = user.resetCode === code;
    const isExpired =
      !user.resetCodeExpires || new Date() > user.resetCodeExpires;

    if (!isCodeMatch || isExpired) {
      throw new BadRequestException({
        status: 'error',
        message: 'Código inválido ou expirado',
        code: 'AUTH_INVALID_RESET_CODE',
      });
    }
  }

  async login(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Credenciais inválidas',
        code: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Credenciais inválidas',
        code: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const payload = { email: user.email, sub: user._id.toString() };

    return successResponse(
      'Login realizado com sucesso',
      'AUTH_LOGIN_SUCCESS',
      {
        token: this.jwtService.sign(payload),
        user: this.userService.toResponseDTO(user),
      },
    );
  }

  async register(dto: RegisterDTO) {
    return this.userService.create(dto);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return successResponse(
        'Se o e-mail existir, um código de verificação será enviado',
        'AUTH_CODE_SENT',
        {},
      );
    }

    const code = randomInt(100000, 999999).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.userService.updateResetCode(user._id.toString(), code, expires);
    await this.mailService.sendVerificationCode(user.email, code);

    return successResponse(
      'Código de verificação enviado',
      'AUTH_CODE_SENT',
      {},
    );
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userService.findByEmailOrThrow(email);

    this.validateResetCode(user, code);

    return successResponse(
      'Código validado com sucesso',
      'AUTH_CODE_VALID',
      {},
    );
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userService.findByEmailOrThrow(email);

    this.validateResetCode(user, code);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updatePassword(user._id.toString(), hashedPassword);
    await this.userService.updateResetCode(user._id.toString(), null, null);

    return successResponse(
      'Senha alterada com sucesso',
      'AUTH_PASSWORD_RESET',
      {},
    );
  }
}
