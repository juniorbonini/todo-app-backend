import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import { RegisterDTO } from '../dto/register.dto';
import { AuthService } from '../service/auth.service';
import { ForgotPasswordDTO } from '../dto/forgot.password.dto';
import { VerifyCodeDTO } from '../dto/verify.code.dto';
import { ResetPasswordDTO } from '../dto/reset.password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDTO) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('verify-code')
  verifyCode(@Body() dto: VerifyCodeDTO) {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }
}
