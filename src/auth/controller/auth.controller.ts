/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post } from '@nestjs/common';

import { LoginDTO } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() dto: LoginDTO) {
    const { email, password } = dto;
    return this.authService.validateUser(email, password);
  }
}
