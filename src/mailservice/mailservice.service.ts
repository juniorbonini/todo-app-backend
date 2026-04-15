import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.API_EMAIL_KEY);
  }

  async sendVerificationCode(email: string, code: string) {
    await this.resend.emails.send({
      from: 'Ascending Time Forge <onboarding.resend.dev>',
      to: email,
      subject: 'Seu código da verificação',
      html: `<strong>Seu código é: ${code}</strong>. Ele expira em 15 minutos`,
    });
  }
}
