import { Body, Controller, Post } from '@nestjs/common';

import { VerifyCodeDTO } from '@/auth/dto/verify.code.dto';
import { MailService } from '../service/mail.service';

@Controller('mailservice')
export class MailserviceController {
  constructor(private readonly mailService: MailService) {}

  @Post('verification-code')
  verificationCode(@Body() dto: VerifyCodeDTO) {
    return this.mailService.sendVerificationCode(dto.email, dto.code);
  }
}
