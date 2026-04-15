/* eslint-disable @typescript-eslint/await-thenable */
import { Body, Controller, Post } from '@nestjs/common';

import { LoginDTO } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.generateForgotPasswordCode(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    return await this.authService.verifyCode(body.email, body.code);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; code: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(
      body.email,
      body.code,
      body.newPassword,
    );
  }
}
